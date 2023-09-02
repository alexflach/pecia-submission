import { useRef } from 'react';
import Doc from '../../editor/Doc';
import Toolbar from '../../editor/Toolbar';
import './EditorPage.css';
import { EditorView } from 'prosemirror-view';
import VersionsMenu from '../../editor/VersionsMenu';
import ColleaguesMenu from "../../colleagues/ColleaguesMenu";

const EditorPage = () => {
    const editorView = useRef<EditorView | undefined>();
    return (
        <div className="editor-page">
            <ColleaguesMenu />
            <Toolbar editorView={editorView} />
            <VersionsMenu />
            <Doc editorView={editorView} />
        </div>
    );
};

export default EditorPage;
