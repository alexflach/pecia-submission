import { EditorState, TextSelection } from 'prosemirror-state';
import schema from '../../../lib/editor/schema';

export const marks = {
    bold: schema.marks.bold,
    italic: schema.marks.italic,
    strikethrough: schema.marks.strikethrough,
    underline: schema.marks.underline,
};

export const nodes = {
    para: schema.nodes.para,
};

export const markInScope = (editorState: EditorState, mark: string) => {
    if (!editorState || !mark) return false;
    const selection = editorState.selection as TextSelection;
    const cursor = selection && selection.$cursor ? selection.$cursor : null;
    const m = marks[mark];
    const storedMarks = editorState.storedMarks;

    if (cursor && cursor.marks() && storedMarks && storedMarks.length) {
        return m.isInSet(cursor.marks() || editorState.storedMarks);
    } else if (cursor && cursor.marks()) {
        return m.isInSet(cursor.marks());
    } else if (storedMarks && storedMarks.length) {
        return m.isInSet(storedMarks);
    } else return false;
};
