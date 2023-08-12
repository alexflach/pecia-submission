import { MarkSpec, DOMOutputSpec } from 'prosemirror-model';

const UnderlineSpec: MarkSpec = {
    toDOM() {
        return ['span', { class: 'underline' }, 0] as DOMOutputSpec;
    },
    parseDOM: [{ tag: 'span.underline' }],
};

export default UnderlineSpec;
