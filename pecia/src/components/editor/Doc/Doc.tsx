import { useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Editor } from '../../../lib/editor';

const Doc = () => {
    const { docID } = useParams();
    const editorRef = useRef<Editor>();
    const docRef = useCallback(
        (node: HTMLElement | null) => {
            if (!docID || !node) return;
            const editor = new Editor(node, docID);
            editorRef.current = editor;
        },
        [docID]
    );
    return <div id="pecia-doc" ref={docRef}></div>;
};

export default Doc;
