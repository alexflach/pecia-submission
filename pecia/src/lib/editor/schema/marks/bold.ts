import { MarkSpec, DOMOutputSpec } from 'prosemirror-model';

const BoldSpec: MarkSpec = {
    toDOM() {
        return ['strong', 0] as DOMOutputSpec;
    },
    parseDOM: [{ tag: 'strong' }],
};

export default BoldSpec;
