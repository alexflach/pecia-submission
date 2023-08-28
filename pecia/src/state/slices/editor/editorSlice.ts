import { createSlice } from '@reduxjs/toolkit';
import {
    Editor,
    setCurrentDocID,
    setTitle,
    setSchema,
    initEditor,
    updateEditorState,
    retrieveDoc,
    retrieveVersions,
    createVersion,
    restoreVersionByID,
    restoreVersionPrep,
    deleteVersion,
} from './editorReducers';

import schema from '../../../lib/editor/schema';

const initialState: Editor = {
    currentDocID: null,
    currentVersionID: null,
    schema,
    editorState: null,
    versions: [],
    doc: null,
    title: '',
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
        restoreVersionByID,
        restoreVersionPrep,
        setTitle,
        deleteVersion,
    },
});

export default editorSlice;
