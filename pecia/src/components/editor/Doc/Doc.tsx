import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import { actions } from '../../../state/slices/editor';
import { EditorView } from 'prosemirror-view';

const { setCurrentDocID, initEditor } = actions;

interface docProps {
    editorView: React.MutableRefObject<EditorView>;
}

const Doc = ({ editorView }: docProps) => {
    const { docID } = useParams();
    const dispatch = useDispatch();
    const editorState = useSelector(
        (state: RootState) => state.editor.editorState
    );
    const docRef = useRef<HTMLDivElement>();

    useEffect(() => {
        if (!docID || !docRef.current) return;
        dispatch(setCurrentDocID(docID));
        if (!editorState) dispatch(initEditor());
    }, [docID, dispatch, editorState]);

    useEffect(() => {
        if (!editorState) return;
        if (!editorView.current) {
            console.log(editorState);
            const view = new EditorView(docRef.current, {
                state: editorState,
                dispatchTransaction(transaction) {
                    dispatch(actions.updateEditorState(transaction));
                },
            });
            editorView.current = view;
        }
        editorView.current.updateState(editorState);
    }, [dispatch, editorState, editorView]);
    return <div id="pecia-doc" ref={docRef}></div>;
};

export default Doc;
