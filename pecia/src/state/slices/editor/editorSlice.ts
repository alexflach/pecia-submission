import { createSlice } from "@reduxjs/toolkit";
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
    mergeVersions,
    addRemoteVersion,
    setOwner,
} from "./editorReducers";

import schema from "../../../lib/editor/schema";

const owner = localStorage.getItem("pecia-user-id");
const initialState: Editor = {
    currentDocID: null,
    currentVersionID: null,
    currentVersionLabel: null,
    schema,
    editorState: null,
    versions: [],
    doc: null,
    title: "",
    owner: owner || "",
};
const editorSlice = createSlice({
    name: "editor",
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
        mergeVersions,
        addRemoteVersion,
        setOwner,
    },
});

export default editorSlice;
