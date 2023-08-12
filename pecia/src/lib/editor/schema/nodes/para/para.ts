import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

const paraSpec: NodeSpec = {
    group: 'block',
    content: 'inline*',
    toDOM() {
        return ['p', 0] as DOMOutputSpec;
    },
    parseDOM: [{ tag: 'p' }],
};
export default paraSpec;
