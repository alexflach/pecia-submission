import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { actions } from '../../../state/slices/editor';

const { setCurrentDocID, initEditor } = actions;

const Doc = () => {
    const { docID } = useParams();
    const dispatch = useDispatch();

    const docRef = useCallback(
        (node: HTMLElement | null) => {
            if (!docID || !node) return;
            dispatch(setCurrentDocID(docID));
            dispatch(initEditor(node));
        },
        [docID, dispatch]
    );
    return <div id="pecia-doc" ref={docRef}></div>;
};

export default Doc;
