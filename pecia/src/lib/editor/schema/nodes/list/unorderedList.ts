import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

const unorderedListSpec: NodeSpec = {
    group: 'block',
    content: 'listItem+',
    toDOM() {
        return ['ul', 0] as DOMOutputSpec;
    },
    parseDOM: [{ tag: 'ul' }],
};
export default unorderedListSpec;
