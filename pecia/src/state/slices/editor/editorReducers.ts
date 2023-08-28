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

const PM_PLUGINS = [
    history(),
    keymap({ 'Mod-z': undo, 'Mod-y': redo }),
    keymap(baseKeymap),
    idPlugin(),
    stepsPlugin(),
];

export type Editor = {
    currentDocID: string | null;
    schema: Schema;
    editorState: EditorState | null;
    versions: Replica[] | null;
    doc: string;
    currentVersionID: string | null;
    title: string;
};

export const setCurrentDocID: CaseReducer<Editor, PayloadAction<string>> = (
    state,
    action: PayloadAction<string>
) => {
    state.currentDocID = action.payload;
};

export const setTitle: CaseReducer<Editor, PayloadAction<string>> = (
    state,
    action: PayloadAction<string>
) => {
    state.title = action.payload;
};

export const deleteVersion: CaseReducer<Editor, PayloadAction<string>> = (
    state,
    action
) => {
    //can't have 0 versions;
    if (!state.versions || state.versions.length < 2) {
        console.log('bailing for lack of version length');
        return;
    }
    //can't delete currently active version
    if (state.currentVersionID === action.payload) {
        console.log('bailing because trying to delete current version');
        return;
    }
    const newVersions = state.versions.filter(
        (version) => version.versionID !== action.payload
    );
    console.log(newVersions);

    state.versions = newVersions;
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
    if (retrievedDoc) {
        const parsed = JSON.parse(retrievedDoc);
        const body = parsed.doc;
        const title = parsed.title;
        state.doc = JSON.stringify(body);
        state.title = title;
    }
};

export const retrieveVersions = (state) => {
    const storedVersions = localStorage.getItem(
        `pecia-versions-${state.currentDocID}`
    );
    const versions = storedVersions ? JSON.parse(storedVersions) : [];
    const versionReplicas = versions.map(
        (version) =>
            new Replica(
                version.tree,
                version.opLog,
                version.id,
                version.docID,
                version.versionID,
                version.title,
                version.description,
                version.label,
                version.owner
            )
    );
    state.versions = versionReplicas;
    //pick the latest version
    state.currentVersionID = versions?.length
        ? versions[versions.length - 1].versionID
        : null;
};

export const updateEditorState = (
    state,
    action: PayloadAction<Transaction>
) => {
    state.editorState = state.editorState.apply(action.payload);
};

interface initEditorPayload {
    owner: string;
    title: string;
}

export const initEditor = {
    reducer: (state, action: PayloadAction<initEditorPayload>) => {
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
            plugins: PM_PLUGINS,
        });

        editorState = initIDs(editorState);
        //if we don't have any version history we stage an 'initial commit'
        if (!state.versions?.length) {
            const currentVersionID = crypto.randomUUID();
            const initVersion = Replica.fromProsemirrorDoc(
                editorState.doc,
                null,
                state.currentDocID,
                currentVersionID
            );
            initVersion.title = action.payload.title;
            initVersion.label = 'Initial Version';
            initVersion.description = 'An initial version created by Pecia';
            initVersion.owner = action.payload.owner;
            state.versions = [initVersion];

            state.currentVersionID = currentVersionID;
        }

        state.editorState = editorState;
    },
    prepare: (owner: string, title: string) => {
        return {
            payload: {
                owner,
                title,
            },
        };
    },
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

type VersionPayload = {
    label: string;
    owner: string;
    title: string;
    description: string;
};
export const createVersion = {
    reducer: (state, action: PayloadAction<VersionPayload>) => {
        const previousReplica = state.versions.find(
            (version) => version.versionID === state.currentVersionID
        );
        const nodes = generateNodeList(state.editorState.doc);

        let newVersion;
        if (previousReplica) {
            newVersion = generateVersionFromReplica(previousReplica, nodes);
        } else {
            newVersion = Replica.fromProsemirrorDoc(
                state.editorState.doc,
                state.currentDocID,
                state.currentDocID,
                null
            );
        }
        const newVersionID = crypto.randomUUID();

        newVersion.owner = action.payload.owner;
        newVersion.label = action.payload.label;
        newVersion.versionID = newVersionID;
        newVersion.title = action.payload.title;
        newVersion.description = action.payload.description;
        state.versions.push(newVersion);

        state.doc = JSON.stringify(newVersion.toProsemirrorDoc());
        state.currentVersionID = newVersionID;
    },
    prepare: (
        owner: string,
        title: string,
        label: string,
        description: string
    ) => {
        return {
            payload: {
                owner,
                title,
                label,
                description,
            },
        };
    },
};

export const restoreVersionByID = (state, action: PayloadAction<string>) => {
    //steps to reboot editor
    const versionToRestore = state.versions.find(
        (version) => version.versionID === action.payload
    );
    if (!versionToRestore) return;
    state.currentVersionID = action.payload;

    state.doc = JSON.stringify(versionToRestore.toProsemirrorDoc());
    state.title = versionToRestore.title;
};

export const restoreVersionPrep = (state, action: PayloadAction<string>) => {
    console.log(action.payload);
};

function generateVersionFromReplica(oldVersion: Replica, nodes: PMNode[]) {
    //start with the old version, we'll apply operations on this based on the differences.
    const newVersion = new Replica(
        oldVersion.tree,
        oldVersion.opLog,
        oldVersion.id,
        oldVersion.docID
    );
    addMissingNodes(newVersion, nodes);
    checkDeletedNodes(newVersion, nodes);
    structureTree(newVersion, nodes);
    arrangeSiblings(newVersion, nodes);
    updateContent(newVersion, nodes);

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
