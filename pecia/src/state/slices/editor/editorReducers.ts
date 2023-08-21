import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { Schema, Node } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

type Editor = {
    currentDocID: string | null;
    schema: Schema;
    editorState: EditorState | null;
    view: EditorView | null;
    doc: Node | null;
};

export const setCurrentDocID: CaseReducer<Editor, PayloadAction<string>> = (
    state,
    action: PayloadAction<string>
) => {
    state.currentDocID = action.payload;
};

export const setSchema = (state, action: PayloadAction<Schema>) => {
    state.schema = action.payload;
};

export const retrieveDoc = (state) => {
    const retrievedDoc = localStorage.getItem(
        `pecia-doc-${state.currentDocID}`
    );
    state.doc = retrievedDoc;
};

export const updateEditorState = (
    state,
    action: PayloadAction<Transaction>
) => {
    console.log(action.payload);
    state.editorState = state.editorState.apply(action.payload);
};

export const initEditor = (state) => {
    if (!state.schema || !state.currentDocID) return;

    let initDoc: Node | undefined;
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
        ],
    });
};
