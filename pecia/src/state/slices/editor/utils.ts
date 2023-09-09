import { EditorState } from "prosemirror-state";
import { Node } from "prosemirror-model";
import { Replica } from "../../../lib/crdt/replica.ts";
import { TreeMoveCRDT } from "../../../lib/crdt/crdt.ts";
import { PMNode } from "./editorReducers.ts";

export const initIDs = (editorState: EditorState) => {
    const tr = editorState.tr;
    let modified = false;
    const nodeTypes = Object.values(editorState.schema.nodes);

    const nodesWithID = nodeTypes
        .filter((type) => type.spec.attrs?.id)
        .map((type) => type.name);

    const shouldHaveID = (node: Node) =>
        nodesWithID.find((type) => type === node.type.name);

    const hasID = (node: Node) => node.attrs?.id;

    editorState.doc.descendants((node, pos) => {
        if (shouldHaveID(node) && !hasID(node)) {
            tr.setNodeAttribute(pos, "id", crypto.randomUUID());
            modified = true;
        }
    });

    return modified ? editorState.apply(tr) : editorState;
};

export const hasOnlyTextContent = (node: Node) => {
    let leaf = true;
    node.descendants((node) => {
        if (node.type.name !== "text") leaf = false;
    });
    return leaf;
};

export const generateVersionFromReplica = (
    oldVersion: Replica,
    nodes: PMNode[],
) => {
    //start with the old version, we'll apply operations on this based on the differences.
    const newVersion = new Replica(
        oldVersion.tree,
        oldVersion.opLog,
        oldVersion.id,
        oldVersion.docID,
    );
    addMissingNodes(newVersion, nodes);
    checkDeletedNodes(newVersion, nodes);
    structureTree(newVersion, nodes);
    arrangeSiblings(newVersion, nodes);
    updateContent(newVersion, nodes);

    return newVersion;
};

export const generateNodeList = (doc: Node) => {
    const nodes = [];
    doc.descendants((node: Node, pos: number) => {
        const nodeType = node.type.name;
        if (nodeType !== "doc" && nodeType !== "text") {
            const resolvedPos = doc.resolve(pos);
            const parent = resolvedPos.parent;
            const previousSibling = resolvedPos.nodeBefore;
            const afterPos = pos + node.nodeSize;
            const resolvedAfterPos = doc.resolve(afterPos);
            const subsequentSibling = resolvedAfterPos.nodeAfter;
            const siblingOffset = resolvedPos.parentOffset;
            const siblingOrder = resolvedPos.index(resolvedPos.depth);
            const leaf = hasOnlyTextContent(node);

            const parentID =
                parent.type.name === "doc" ? "ROOT" : parent.attrs?.id;

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
                siblingOffset,
                siblingOrder,
            });
        }
    });
    console.log(nodes);
    return nodes;
};

export const addMissingNodes = (replica: Replica, nodes: PMNode[]) => {
    const seenNodes = replica.tree.map((node) => node.child);
    const missingNodes = nodes.filter(
        (node) => !seenNodes.find((n) => n === node.child),
    );
    while (missingNodes.length) {
        for (let i = missingNodes.length - 1; i >= 0; i--) {
            //check if parent is not in tree
            if (
                !(missingNodes[i].parent === "ROOT") &&
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
                missingNodes[i].attrs,
                missingNodes[i].siblingOrder,
            );
            //add the node to list of old nodes and remove from missing one
            seenNodes.push(missingNodes[i].child);
            missingNodes.splice(i, 1);
        }
    }
};

export const checkDeletedNodes = (replica: Replica, nodes: PMNode[]) => {
    //get the nodes in the tree that are children of root (not trash)
    const liveNodes = replica.tree.filter(
        (node) =>
            node.child !== "ROOT" &&
            node.child !== "TRASH" &&
            TreeMoveCRDT.ancestor(replica.tree, "ROOT", node.child),
    );
    const deletedNodes = liveNodes.filter(
        (node) => !nodes.find((n) => n.child === node.child),
    );
    for (const node of deletedNodes) {
        replica.moveNode(node.child, "TRASH");
    }
};

export const structureTree = (replica: Replica, nodes: PMNode[]) => {
    const movedNodes = nodes.filter((node) => {
        const matchedNode = replica.tree.find((n) => node.child === n.child);
        return node.parent !== matchedNode.parent;
    });
    for (const node of movedNodes) {
        replica.moveNode(node.child, node.parent);
    }
};

export const arrangeSiblings = (replica: Replica, nodes: PMNode[]) => {
    const movedNodes = nodes.filter((node) => {
        const matchedNode = replica.tree.find((n) => n.child === node.child);
        return !(
            matchedNode.meta.previousSibling === node.previousSibling &&
            matchedNode.meta.subsequentSibling === node.subsequentSibling
        );
    });

    for (const node of movedNodes) {
        replica.moveSibling(
            node.child,
            node.previousSibling,
            node.subsequentSibling,
            node.siblingOrder,
        );
    }
};

export const updateContent = (replica: Replica, nodes: PMNode[]) => {
    const updatedContent = nodes.filter((node) => {
        if (!node.leaf) return false;
        const matchedNode = replica.tree.find((n) => node.child === n.child);
        if (
            matchedNode.meta.content === JSON.stringify(node.content) &&
            JSON.stringify(matchedNode.meta.attrs) ===
                JSON.stringify(node.attrs)
        ) {
            return false;
        } else return true;
    });
    for (const node of updatedContent) {
        replica.updateNodeContent(
            node.child,
            JSON.stringify(node.content),
            node.attrs,
        );
    }
};
