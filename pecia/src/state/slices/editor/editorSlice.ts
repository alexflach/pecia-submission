import { createSlice } from '@reduxjs/toolkit';
import { Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import {
    setCurrentDocID,
    setSchema,
    initEditor,
    updateEditorState,
    retrieveDoc,
} from './editorReducers';

import schema from '../../../lib/editor/schema';
import { Replica } from '../../../lib/crdt/replica';

type Editor = {
    currentDocID: string | null;
    schema: Schema;
    editorState: EditorState | null;
    replica: Replica | null;
};

const initialState: Editor = {
    currentDocID: null,
    schema,
    editorState: null,
    replica: null,
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
