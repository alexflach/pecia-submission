import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { Schema, Node } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Plugin, PluginKey } from 'prosemirror-state';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap, toggleMark, wrapIn } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list';

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

export const toggleBold = (state) => {
    state.boldActive = !state.boldActive;
    if (!state.view) return;
    toggleMark(schema.marks.bold)(state.view.state, state.view.dispatch);
    state.view.focus();
};

export const toggleItalic = (state) => {
    state.italicActive = !state.italicActive;
    if (!state.view) return;
    toggleMark(schema.marks.italic)(state.view.state, state.view.dispatch);
    state.view.focus();
};

export const toggleStrikethrough: CaseReducer<Editor> = (state) => {
    state.strikethroughActive = !state.strikethroughActive;
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

export const wrapInBlockquote = (state) => {
    if (!state.view) return;
    wrapIn(schema.nodes.blockquote)(state.view, state.view.dispatch);
};

export const wrapInOrderedList = (state) => {
    if (!state.view) return;
    wrapInList(schema.nodes.ordered_list)(state.view, state.view.dispatch);
};

export const wrapInUnorderedList = (state) => {
    if (!state.view) return;
    wrapInList(schema.nodes.bulletList)(state.view, state.view.dispatch);
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
            createDocIDPlugin(state.currentDocID),
        ],
    });
};
