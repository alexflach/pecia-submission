import { MarkSpec, DOMOutputSpec } from 'prosemirror-model';

const StrikethroughSpec: MarkSpec = {
    toDOM() {
        return ['span', { class: 'strikethrough' }, 0] as DOMOutputSpec;
    },
    parseDOM: [{ tag: 'span.strikethrough' }],
};

export default StrikethroughSpec;
