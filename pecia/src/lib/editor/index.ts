//Deprecated, this is if you want an editor outside the Redux store

import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import schema from './schema';
import { EditorView } from 'prosemirror-view';
import { Plugin, PluginKey } from 'prosemirror-state';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

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
export class Editor {
    schema = schema;
    state: EditorState;
    view: EditorView;
    docID: string;

    constructor(node: HTMLElement, docID: string) {
        const storedDoc = localStorage.getItem(`pecia-doc-${docID}`);
        this.docID = docID;

        let doc;
        try {
            doc = storedDoc
                ? Node.fromJSON(schema, JSON.parse(storedDoc))
                : undefined;
        } catch (e) {
            console.error(e);
        }
        this.state = EditorState.create({
            schema: this.schema,
            doc,
            plugins: [
                history(),
                keymap({ 'Mod-z': undo, 'Mod-y': redo }),
                keymap(baseKeymap),
                createDocIDPlugin(this.docID),
            ],
        });

        this.view = new EditorView(node, { state: this.state });
    }
}
