import { NodeSpec } from 'prosemirror-model';

const blockQuoteSpec: NodeSpec = {
    content: 'block+',
    group: 'block',
    attrs: { id: { default: null } },
    toDOM(node) {
        return ['blockquote', { 'data-id': node.attrs.id }, 0];
    },
    parseDOM: [
        {
            tag: 'blockquote',
            getAttrs: (node: HTMLElement) => {
                return {
                    id: node.getAttribute('data-id'),
                };
            },
        },
    ],
};

export default blockQuoteSpec;
