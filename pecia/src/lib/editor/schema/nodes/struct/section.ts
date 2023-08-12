import { NodeSpec } from 'prosemirror-model';

const sectionSpec: NodeSpec = {
    content: 'title block+',
    attrs: {},
    toDOM() {
        return ['section', 0];
    },
    parseDOM: [{ tag: 'section' }],
};

export default sectionSpec;
