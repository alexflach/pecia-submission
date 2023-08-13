import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Schema, Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Plugin, PluginKey } from 'prosemirror-state';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

import schema from '../../../lib/editor/schema';

const docIDPluginKey = new PluginKey('docID');
//This simple plugin provides a single piece of metadata
//the document ID. This is needed so that Prosemirror
//actions can access the ID (eg for saving or loading the doc)
const createDocIDPlugin = (docID: string) => {
    return new Plugin({
        key: docIDPluginKey,
        state: {
            init: () => {
                return docID;
            },
            apply: (_tr, val) => val,
        },
    });
};

type Editor = {
    boldActive: boolean;
    italicActive: boolean;
    strikethroughActive: boolean;
    currentDocID: string | null;
    schema: Schema;
    editorState: EditorState | null;
    view: EditorView | null;
    doc: Node | null;
};

const toggleBold = (state) => {
    state.boldActive = !state.boldActive;
};

const toggleItalic = (state) => {
    state.italicActive = !state.italicActive;
};

const toggleStrikethrough = (state) => {
    state.strikethroughActive = !state.strikethroughActive;
};

const setCurrentDocID: CaseReducer<Editor, PayloadAction<string>> = (
    state,
    action: PayloadAction<string>
) => {
    state.currentDocID = action.payload;
};

const setSchema = (state, action: PayloadAction<Schema>) => {
    state.schema = action.payload;
};

const initEditor = (state, action: PayloadAction<HTMLElement>) => {
    if (!state.schema || !state.currentDocID) return;

    let initDoc;
    try {
        initDoc = state.doc
            ? Node.fromJSON(state.schema, JSON.parse(state.doc))
            : undefined;
    } catch (err) {
        console.error(err);
    }
    state.editorState = EditorState.create({
        schema: state.schema,
        doc: initDoc,
        plugins: [
            history(),
            keymap({ 'Mod-z': undo, 'Mod-y': redo }),
            keymap(baseKeymap),
            createDocIDPlugin(state.currentDocID),
        ],
    });
    state.view = new EditorView(action.payload, { state: state.editorState });
};

const initialState: Editor = {
    boldActive: false,
    italicActive: false,
    strikethroughActive: false,
    currentDocID: null,
    schema,
    editorState: null,
    view: null,
    doc: null,
};
const editorSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        toggleBold,
        toggleItalic,
        toggleStrikethrough,
        setCurrentDocID,
        setSchema,
        initEditor,
    },
});

export default editorSlice;
