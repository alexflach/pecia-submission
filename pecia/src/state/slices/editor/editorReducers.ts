import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { Schema, Node } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import idPlugin from '../../../lib/editor/plugins/idPlugin';
import stepsPlugin from '../../../lib/editor/plugins/stepsPlugin';
import { Replica } from '../../../lib/crdt/replica';

type Editor = {
    currentDocID: string | null;
    schema: Schema;
    editorState: EditorState | null;
    replica: Replica | null;
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
    state.editorState = state.editorState.apply(action.payload);
    console.log(JSON.stringify(state.replica));
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
    if (!state.replica)
        state.replica = new Replica(null, null, null, state.currentDocID);
    state.editorState = EditorState.create({
        schema: state.schema,
        doc: initDoc,
        plugins: [
            history(),
            keymap({ 'Mod-z': undo, 'Mod-y': redo }),
            keymap(baseKeymap),
            idPlugin(),
            stepsPlugin(),
        ],
    });
};
