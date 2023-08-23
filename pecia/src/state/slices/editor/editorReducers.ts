import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { Schema, Node, Fragment } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import idPlugin from '../../../lib/editor/plugins/idPlugin';
import stepsPlugin from '../../../lib/editor/plugins/stepsPlugin';
import { Replica } from '../../../lib/crdt/replica';
import { hasOnlyTextContent, initIDs } from './utils';
import { TreeMoveCRDT } from '../../../lib/crdt/crdt';

export type Editor = {
    currentDocID: string | null;
    schema: Schema;
    editorState: EditorState | null;
    versions: Replica[] | null;
    doc: string;
    currentVersionID: string | null;
};

export const setCurrentDocID: CaseReducer<Editor, PayloadAction<string>> = (
    state,
    action: PayloadAction<string>
) => {
    state.currentDocID = action.payload;
};

export const setSchema = (state, action: PayloadAction<Schema>) => {
    state.schema = action.payload;
};

export const retrieveDoc: CaseReducer<Editor, PayloadAction<null>> = (
    state
) => {
    const retrievedDoc = localStorage.getItem(
        `pecia-doc-${state.currentDocID}`
    );
    state.doc = retrievedDoc;
};

export const retrieveVersions = (state) => {
    const retrievedVersions = localStorage.getItem(
        `pecia-versions-${state.currentDocID}`
    );
    const versions = JSON.parse(retrievedVersions);
    state.versions = versions || [];
    //pick the latest version
    state.currentVersionID = versions?.length
        ? versions[versions.length - 1]
        : null;
};

export const updateEditorState = (
    state,
    action: PayloadAction<Transaction>
) => {
    state.editorState = state.editorState.apply(action.payload);
};

export const initEditor = (state) => {
    if (!state.schema || !state.currentDocID) return;

    let initDoc: Node | undefined;

    try {
        initDoc = state.doc
            ? Node.fromJSON(state.schema, JSON.parse(state.doc))
            : undefined;
    } catch (err) {
        console.error(err);
    }

    let editorState = EditorState.create({
        schema: state.schema,
        doc: initDoc,
        plugins: [
            history(),
            keymap({ 'Mod-z': undo, 'Mod-y': redo }),
            keymap(baseKeymap),
            idPlugin(),
            stepsPlugin(),
        ],
    });

    editorState = initIDs(editorState);
    //if we don't have any version history we stage an 'initial commit'
    if (!state.versions?.length) {
        const currentVersion = crypto.randomUUID();
        state.versions = [
            Replica.fromProsemirrorDoc(
                editorState.doc,
                null,
                state.currentDocID,
                currentVersion
            ),
        ];

        state.currentVersionID = currentVersion;
    }

    state.editorState = editorState;
};

export interface PMNode {
    child: string;
    parent: string;
    previousSibling: string;
    subsequentSibling: string;
    content: Fragment;
    type: string;
    attrs: object;
    leaf: boolean;
}

export const createVersion = (state) => {
    const previousReplica = state.versions.find(
        (version) => version.versionID === state.currentVersionID
    );
    const nodes = generateNodeList(state.editorState.doc);

    const newVersion = generateVersionFromReplica(previousReplica, nodes);
    const newVersionID = crypto.randomUUID();

    newVersion.versionID = newVersionID;

    state.versions.push(newVersion);
    state.currentVersionID = newVersionID;
};

function generateVersionFromReplica(oldVersion: Replica, nodes: PMNode[]) {
    //start with the old version, we'll apply operations on this based on the differences.
    // const generated = structuredClone(oldVersion);
    const newVersion = new Replica(
        oldVersion.tree,
        oldVersion.opLog,
        oldVersion.id,
        oldVersion.docID,
        oldVersion.versionID
    );
    addMissingNodes(newVersion, nodes);
    checkDeletedNodes(newVersion, nodes);
    structureTree(newVersion, nodes);
    arrangeSiblings(newVersion, nodes);
    updateContent(newVersion, nodes);

    console.log(newVersion.toProsemirrorDoc());
    return newVersion;
}

function generateNodeList(doc: Node) {
    const nodes = [];
    doc.descendants((node: Node, pos: number) => {
        const nodeType = node.type.name;
        if (nodeType !== 'doc' && nodeType !== 'text') {
            const resolvedPos = doc.resolve(pos);
            const parent = resolvedPos.parent;
            const previousSibling = resolvedPos.nodeBefore;
            const afterPos = pos + node.nodeSize;
            const resolvedAfterPos = doc.resolve(afterPos);
            const subsequentSibling = resolvedAfterPos.nodeAfter;
            const leaf = hasOnlyTextContent(node);

            const parentID =
                parent.type.name === 'doc' ? 'ROOT' : parent.attrs?.id;

            const beforeID = previousSibling?.attrs?.id || null;
            const afterID = subsequentSibling?.attrs?.id || null;

            nodes.push({
                child: node.attrs.id,
                parent: parentID,
                previousSibling: beforeID,
                subsequentSibling: afterID,
                content: node.content,
                type: nodeType,
                attrs: node.attrs,
                leaf,
            });
        }
    });
    return nodes;
}

function addMissingNodes(replica: Replica, nodes: PMNode[]) {
    const seenNodes = replica.tree.map((node) => node.child);
    const missingNodes = nodes.filter(
        (node) => !seenNodes.find((n) => n === node.child)
    );
    while (missingNodes.length) {
        for (let i = missingNodes.length - 1; i >= 0; i--) {
            //check if parent is not in tree
            if (
                !(missingNodes[i].parent === 'ROOT') &&
                !seenNodes.find((n) => n === missingNodes[i].parent)
            )
                continue;
            replica.createNode(
                missingNodes[i].leaf
                    ? JSON.stringify(missingNodes[i].content)
                    : null,
                missingNodes[i].type,
                missingNodes[i].parent,
                missingNodes[i].previousSibling,
                missingNodes[i].subsequentSibling,
                missingNodes[i].child,
                missingNodes[i].attrs
            );
            //add the node to list of old nodes and remove from missing one
            seenNodes.push(missingNodes[i].child);
            missingNodes.splice(i, 1);
        }
    }
}
function checkDeletedNodes(replica: Replica, nodes: PMNode[]) {
    //get the nodes in the tree that are children of root (not trash)
    const liveNodes = replica.tree.filter(
        (node) =>
            node.child !== 'ROOT' &&
            node.child !== 'TRASH' &&
            TreeMoveCRDT.ancestor(replica.tree, 'ROOT', node.child)
    );
    const deletedNodes = liveNodes.filter(
        (node) => !nodes.find((n) => n.child === node.child)
    );
    for (const node of deletedNodes) {
        replica.moveNode(node.child, 'TRASH');
    }
}
function structureTree(replica: Replica, nodes: PMNode[]) {
    const movedNodes = nodes.filter((node) => {
        const matchedNode = replica.tree.find((n) => node.child === n.child);
        return node.parent !== matchedNode.parent;
    });
    for (const node of movedNodes) {
        replica.moveNode(node.child, node.parent);
    }
}
function arrangeSiblings(replica: Replica, nodes: PMNode[]) {
    const movedSiblings = nodes.filter((node) => {
        const matchedNode = replica.tree.find((n) => node.child === n.child);
        return !(
            matchedNode.meta.previousSibling === node.previousSibling &&
            matchedNode.meta.subsequentSibling === node.subsequentSibling
        );
    });
    for (const node of movedSiblings) {
        replica.moveSibling(
            node.child,
            node.previousSibling,
            node.subsequentSibling
        );
    }
}
function updateContent(replica: Replica, nodes: PMNode[]) {
    const updatedContent = nodes.filter((node) => {
        if (!node.leaf) return false;
        const matchedNode = replica.tree.find((n) => node.child === n.child);
        return !(matchedNode.meta.content === JSON.stringify(node.content));
    });
    for (const node of updatedContent) {
        replica.updateNodeContent(node.child, JSON.stringify(node.content));
    }
}
