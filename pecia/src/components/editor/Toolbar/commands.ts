import { EditorView } from 'prosemirror-view';
import { DOMSerializer } from 'prosemirror-model';
import { toggleMark, setBlockType, wrapIn } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list';
import { undo, redo } from 'prosemirror-history';
import { marks, nodes } from './utils';
import { actions as docsActions } from '../../../state/slices/docs';
import { actions as editorActions } from '../../../state/slices/editor';
import schema from '../../../lib/editor/schema';
import { Dispatch } from '@reduxjs/toolkit';
import { NavigateFunction } from 'react-router-dom';

export const toggle = (editorView: EditorView, markType: string) => {
    if (!editorView) return;
    toggleMark(marks[markType])(editorView.state, editorView.dispatch);
    editorView.focus();
};

export const setBlock = (editorView: EditorView, nodeType: string) => {
    if (!editorView) return;
    setBlockType(nodes[nodeType])(editorView.state, editorView.dispatch);
    editorView.focus();
};

export const wrapInBlockquote = (editorView: EditorView) => {
    if (!editorView) return;
    wrapIn(schema.nodes.blockquote)(editorView.state, editorView.dispatch);
    editorView.focus();
};

export const wrapInListCommand = (editorView: EditorView) => {
    if (!editorView) return;
    wrapInList(schema.nodes.bullet_list)(editorView.state, editorView.dispatch);
    editorView.focus();
};
export const setHeadingLevel = (editorView: EditorView, level: number) => {
    if (!editorView) return;
    const setLevel = setBlockType(schema.nodes.heading, { level });
    setLevel(editorView.state, editorView.dispatch);
    editorView.focus();
};

export const undoCommand = (editorView: EditorView) => {
    if (!editorView) return;
    undo(editorView.state, editorView.dispatch, editorView);
    editorView.focus();
};
export const redoCommand = (editorView: EditorView) => {
    if (!editorView) return;
    redo(editorView.state, editorView.dispatch, editorView);
    editorView.focus();
};

//helper method to download the input url with the input fileName
function download(url: string, fileName: string): void {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();
}

//Custom command to download an HTML serialization of the current document.
export const downloadDoc = (editorView: EditorView) => {
    if (!editorView) return;
    const fragment = DOMSerializer.fromSchema(schema).serializeFragment(
        editorView.state.doc.content
    );
    //needed as the serializer returns a fragment, which has no innerHTML property
    const container = document.createElement('doc');
    container.appendChild(fragment);

    const objectURL = URL.createObjectURL(new Blob([container.innerHTML]));

    download(objectURL, `doc.html`);
    URL.revokeObjectURL(objectURL);
    editorView.focus();
};

export const saveDoc = (editorView: EditorView, id: string) => {
    if (!editorView) return;
    const doc = editorView.state.doc.toJSON();
    try {
        localStorage.setItem(`pecia-doc-${id}`, JSON.stringify(doc));
    } catch (err) {
        console.error(err);
    }
    editorView.focus();
};

export const deleteDoc = (
    id: string,
    dispatch: Dispatch,
    navigate: NavigateFunction
) => {
    if (
        confirm(
            'Are you sure you want to delete the document? This cannot be undone.'
        )
    ) {
        localStorage.removeItem(`pecia-doc-${id}`);
        dispatch(docsActions.deleteDoc(id));
        navigate('/');
    }
};

export const shareDoc = () => {};

export const versionDoc = (dispatch: Dispatch) => {
    dispatch(editorActions.createVersion());
};
