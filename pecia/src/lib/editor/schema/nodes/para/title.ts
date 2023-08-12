import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

const titleSpec: NodeSpec = {
    content: 'text*',
    marks: '',
    toDOM() {
        return ['h2', { class: 'title' }, 0] as DOMOutputSpec;
    },
    parseDOM: [{ tag: 'h2.title', priority: 60 }],
};

export default titleSpec;
