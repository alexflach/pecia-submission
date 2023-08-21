import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

const headingSpec: NodeSpec = {
    group: 'block',
    content: 'inline*',
    marks: 'italic',
    attrs: {
        level: { default: 1 },
        id: { default: null },
    },
    toDOM(node) {
        return [
            `h${node.attrs.level}`,
            { 'data-id': node.attrs.id },
            0,
        ] as DOMOutputSpec;
    },
    parseDOM: [
        {
            tag: 'h1',
            getAttrs: (dom: HTMLElement) => ({
                id: dom.getAttribute('data-id'),
                level: 1,
            }),
        },
        {
            tag: 'h2',
            getAttrs: (dom: HTMLElement) => ({
                id: dom.getAttribute('data-id'),
                level: 2,
            }),
        },
        {
            tag: 'h3',
            getAttrs: (dom: HTMLElement) => ({
                id: dom.getAttribute('data-id'),
                level: 3,
            }),
        },
        {
            tag: 'h4',
            getAttrs: (dom: HTMLElement) => ({
                id: dom.getAttribute('data-id'),
                level: 4,
            }),
        },
        {
            tag: 'h5',
            getAttrs: (dom: HTMLElement) => ({
                id: dom.getAttribute('data-id'),
                level: 5,
            }),
        },
        {
            tag: 'h6',
            getAttrs: (dom: HTMLElement) => ({
                id: dom.getAttribute('data-id'),
                level: 6,
            }),
        },
    ],
};
export default headingSpec;
