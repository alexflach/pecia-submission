import { useRef } from 'react';
import Doc from '../../editor/Doc';
import Toolbar from '../../editor/Toolbar';
import './EditorPage.css';
import { EditorView } from 'prosemirror-view';

const EditorPage = () => {
    const editorView = useRef<EditorView | undefined>();
    return (
        <div className="editor-page">
            <Toolbar editorView={editorView} />
            <Doc editorView={editorView} />
        </div>
    );
};

export default EditorPage;
