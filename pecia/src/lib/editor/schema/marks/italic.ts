import { MarkSpec, DOMOutputSpec } from 'prosemirror-model';

const ItalicSpec: MarkSpec = {
    toDOM() {
        return ['em', 0] as DOMOutputSpec;
    },
    parseDOM: [{ tag: 'em' }],
};

export default ItalicSpec;
