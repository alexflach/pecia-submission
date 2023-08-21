import { Node } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';

const idPlugin = () => {
    return new Plugin({
        appendTransaction: (transactions, oldState, newState) => {
            const tr = newState.tr;
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
                        console.log(node);
                        const attrs = node.attrs;
                        tr.setNodeMarkup(pos, undefined, {
                            ...attrs,
                            id: crypto.randomUUID(),
                        });
                        modified = true;
                        console.log(tr);
                    }
                });
            }
            return modified ? tr : null;
        },
    });
};

export default idPlugin;
