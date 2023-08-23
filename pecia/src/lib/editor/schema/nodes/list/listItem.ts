// based on https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.ts
// customised to support ids
import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

const listItemSpec: NodeSpec = {
    content: 'para block*',
    attrs: { id: { default: null } },
    toDOM(node) {
        return ['li', { 'data-id': node.attrs.id }, 0] as DOMOutputSpec;
    },
    parseDOM: [
        {
            tag: 'li',
            getAttrs: (dom: HTMLElement) => {
                return { id: dom.getAttribute('data-id') };
            },
        },
    ],
    defining: true,
};
export default listItemSpec;
