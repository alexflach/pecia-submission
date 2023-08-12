import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

const orderedListSpec: NodeSpec = {
    group: 'block',
    content: 'listItem+',
    toDOM() {
        return ['ol', 0] as DOMOutputSpec;
    },
    parseDOM: [{ tag: 'ol' }],
};
export default orderedListSpec;
