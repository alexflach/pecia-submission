import { createSlice } from '@reduxjs/toolkit';
import { Schema, Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import {
    setCurrentDocID,
    setSchema,
    initEditor,
    updateEditorState,
    retrieveDoc,
} from './editorReducers';

import schema from '../../../lib/editor/schema';

type Editor = {
    currentDocID: string | null;
    schema: Schema;
    editorState: EditorState | null;
    doc: Node | null;
};

const initialState: Editor = {
    currentDocID: null,
    schema,
    editorState: null,
    doc: null,
};
const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setCurrentDocID,
        setSchema,
        initEditor,
        updateEditorState,
        retrieveDoc,
    },
});

export default editorSlice;
