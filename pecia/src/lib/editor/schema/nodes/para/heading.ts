import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

const headingSpec: NodeSpec = {
    group: 'block',
    content: 'inline*',
    marks: 'italic',
    attrs: {
        level: { default: 1 },
    },
    toDOM(node) {
        return [`h${node.attrs.level}`, 0] as DOMOutputSpec;
    },
    parseDOM: [
        { tag: 'h1', attrs: { level: 1 } },
        { tag: 'h2', attrs: { level: 2 } },
        { tag: 'h3', attrs: { level: 3 } },
        { tag: 'h4', attrs: { level: 4 } },
        { tag: 'h5', attrs: { level: 5 } },
        { tag: 'h6', attrs: { level: 6 } },
    ],
};
export default headingSpec;
