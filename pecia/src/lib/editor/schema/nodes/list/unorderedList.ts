import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

const unorderedListSpec: NodeSpec = {
    group: 'block',
    attrs: {
        id: { default: null },
    },
    content: 'listItem+',
    toDOM(node) {
        return ['ul', { 'data-id': node.attrs.id }, 0] as DOMOutputSpec;
    },
    parseDOM: [
        {
            tag: 'ul',
            getAttrs: (dom: HTMLElement) => {
                return { id: dom.getAttribute('data-id') };
            },
        },
    ],
};
export default unorderedListSpec;
