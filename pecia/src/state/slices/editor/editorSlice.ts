import { createSlice } from '@reduxjs/toolkit';
import {
    Editor,
    setCurrentDocID,
    setSchema,
    initEditor,
    updateEditorState,
    retrieveDoc,
    retrieveVersions,
    createVersion,
} from './editorReducers';

import schema from '../../../lib/editor/schema';

const initialState: Editor = {
    currentDocID: null,
    currentVersionID: null,
    schema,
    editorState: null,
    versions: [],
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
        retrieveVersions,
        createVersion,
    },
});

export default editorSlice;
