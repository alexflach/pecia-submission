import { createSlice } from '@reduxjs/toolkit';
import { Schema, Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import {
    toggleBold,
    toggleItalic,
    toggleStrikethrough,
    setCurrentDocID,
    setSchema,
    initEditor,
    updateEditorState,
    wrapInBlockquote,
    wrapInOrderedList,
    wrapInUnorderedList,
} from './editorReducers';

import schema from '../../../lib/editor/schema';

type Editor = {
    boldActive: boolean;
    italicActive: boolean;
    strikethroughActive: boolean;
    currentDocID: string | null;
    schema: Schema;
    editorState: EditorState | null;
    doc: Node | null;
};

const initialState: Editor = {
    boldActive: false,
    italicActive: false,
    strikethroughActive: false,
    currentDocID: null,
    schema,
    editorState: null,
    doc: null,
};
const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        toggleBold,
        toggleItalic,
        toggleStrikethrough,
        setCurrentDocID,
        setSchema,
        initEditor,
        updateEditorState,
        wrapInBlockquote,
        wrapInOrderedList,
        wrapInUnorderedList,
    },
});

export default editorSlice;
