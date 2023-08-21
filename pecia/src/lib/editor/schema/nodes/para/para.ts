import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

const paraSpec: NodeSpec = {
    group: 'block',
    content: 'inline*',
    attrs: {
        id: { default: null },
    },
    toDOM(node) {
        return ['p', { 'data-id': node.attrs.id }, 0] as DOMOutputSpec;
    },
    parseDOM: [
        {
            tag: 'p',
            getAttrs: (dom: HTMLElement) => {
                return { id: dom.getAttribute('data-id') };
            },
        },
    ],
};
export default paraSpec;
