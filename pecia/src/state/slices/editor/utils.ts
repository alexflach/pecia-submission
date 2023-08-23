import { EditorState } from 'prosemirror-state';
import { Node } from 'prosemirror-model';

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
            tr.setNodeAttribute(pos, 'id', crypto.randomUUID());
            modified = true;
        }
    });

    return modified ? editorState.apply(tr) : editorState;
};

export const hasOnlyTextContent = (node: Node) => {
    let leaf = true;
    node.descendants((node) => {
        if (node.type.name !== 'text') leaf = false;
    });
    return leaf;
};
