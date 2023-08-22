import { useRef, useEffect } from 'react';
import { Editor } from '../lib/editor';

const useProseMirror = (
    node: null | HTMLElement,
    docID: string | undefined
) => {
    const editorRef = useRef<Editor>();
    useEffect(() => {
        if (node && docID && !editorRef.current) {
            const editor = new Editor(node, docID);
            editorRef.current = editor;
        }
    }, [node, docID]);
    return editorRef;
};

export default useProseMirror;
