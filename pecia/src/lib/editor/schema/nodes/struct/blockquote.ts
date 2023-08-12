import { NodeSpec } from 'prosemirror-model';

const blockQuoteSpec: NodeSpec = {
    content: 'block+',
    group: 'block',
    attrs: {},
    toDOM() {
        return ['blockquote', 0];
    },
    parseDOM: [{ tag: 'blockquote' }],
};

export default blockQuoteSpec;
