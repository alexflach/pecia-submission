import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

const listItemSpec: NodeSpec = {
    content: 'text*',
    toDOM() {
        return ['li', 0] as DOMOutputSpec;
    },
    parseDOM: [{ tag: 'li' }],
};
export default listItemSpec;
