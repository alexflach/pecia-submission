import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import { actions as editorActions } from '../../../state/slices/editor';
import { EditorView } from 'prosemirror-view';
import useQuery from '../../../hooks/useQuery';

import './Doc.css';

const {
    setCurrentDocID,
    initEditor,
    retrieveDoc,
    retrieveVersions,
    updateEditorState,
} = editorActions;

interface docProps {
    editorView: React.MutableRefObject<EditorView>;
}

const Doc = ({ editorView }: docProps) => {
    const query = useQuery();
    const dispatch = useDispatch();
    const { editorState, currentDocID } = useSelector(
        (state: RootState) => state.editor
    );

    const userID = useSelector((state: RootState) => state.user.peciaID);
    const title = useSelector((state: RootState) => state.docs.docs).filter(
        (doc) => doc.id === currentDocID
    );

    const docRef = useRef<HTMLDivElement>();
    const docID = query.get('doc');

    //if we have navigated to a new document we:
    //update our current doc id and retrieve the doc if possible from local storage
    //then we re-initialize the editor state
    useEffect(() => {
        if (docID !== currentDocID) {
            dispatch(setCurrentDocID(docID));
            dispatch(retrieveDoc());
            dispatch(retrieveVersions());
            dispatch(initEditor(userID, title));
        }
    }, [docID, currentDocID, dispatch, title, userID]);

    //render the editor. We can only do this if we have a dom node to render to, and a state to render.
    //Every time the editor state changes, we shall update the view here.
    useEffect(() => {
        if (!editorState || !docRef.current) return;
        if (!editorView.current) {
            const view = new EditorView(docRef.current, {
                state: editorState,
                dispatchTransaction(transaction) {
                    dispatch(updateEditorState(transaction));
                },
            });
            editorView.current = view;
        }
        editorView.current.updateState(editorState);
    }, [dispatch, editorState, editorView]);
    return <div id="pecia-doc" ref={docRef}></div>;
};

export default Doc;
