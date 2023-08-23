//adapted from Prosemirror forum:
//https://discuss.prosemirror.net/t/how-i-can-attach-attribute-with-dynamic-value-when-new-paragraph-is-inserted/751/3
import { Node } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';

const idPlugin = () => {
    return new Plugin({
        appendTransaction: (transactions, oldState, newState) => {
            const tr = newState.tr;
            console.log(oldState.doc.toJSON());
            let modified = false;
            const nodeTypes = Object.values(newState.schema.nodes);

            const nodesWithID = nodeTypes
                .filter((type) => type.spec.attrs?.id)
                .map((type) => type.name);

            const shouldHaveID = (node: Node) =>
                nodesWithID.find((type) => type === node.type.name);

            const hasID = (node: Node) => node.attrs?.id;

            if (transactions.some((tr) => tr.docChanged)) {
                newState.doc.descendants((node, pos) => {
                    if (shouldHaveID(node) && !hasID(node)) {
                        tr.setNodeAttribute(pos, 'id', crypto.randomUUID());
                        modified = true;
                    }
                });
            }
            return modified ? tr : null;
        },
    });
};

export default idPlugin;
