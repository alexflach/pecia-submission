//adapted from https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.ts
//modified to support IDs
import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

const orderedListSpec: NodeSpec = {
    attrs: {
        order: {
            default: 1,
        },
        id: {
            default: null,
        },
    },
    group: 'block',
    content: 'listItem+',
    parseDOM: [
        {
            tag: 'ol',
            getAttrs: (dom: HTMLElement) => {
                return {
                    id: dom.getAttribute('data-id'),
                    order: dom.hasAttribute('start')
                        ? +dom.getAttribute('start')!
                        : 1,
                };
            },
        },
    ],
    toDOM(node) {
        return (
            node.attrs.order === 1
                ? ['ol', { 'data-id': node.attrs.id }, 0]
                : [
                      'ol',
                      { 'data-id': node.attrs.id, order: node.attrs.order },
                      0,
                  ]
        ) as DOMOutputSpec;
    },
};
export default orderedListSpec;
