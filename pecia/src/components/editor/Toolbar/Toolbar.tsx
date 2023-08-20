import { EditorView } from 'prosemirror-view';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import {
    toggle,
    setBlock,
    wrapInBlockquote,
    downloadDoc,
    undoCommand,
    redoCommand,
    wrapInListCommand,
    setHeadingLevel,
} from './commands';
import { markInScope } from './utils';

import * as Toolbar from '@radix-ui/react-toolbar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    DownloadIcon,
    FontBoldIcon,
    FontItalicIcon,
    StrikethroughIcon,
    UnderlineIcon,
    PilcrowIcon,
    QuoteIcon,
    ListBulletIcon,
} from '@radix-ui/react-icons';

import './Toolbar.css';

interface toolbarProps {
    editorView: React.MutableRefObject<EditorView>;
}

const EditorToolbar = ({ editorView }: toolbarProps) => {
    const editorState = useSelector(
        (state: RootState) => state.editor.editorState
    );
    console.log(markInScope(editorState, 'bold'), 'bold');
    console.log(markInScope(editorState, 'italic'), 'italic');
    return (
        <>
            <Toolbar.Root
                className="toolbar-root"
                aria-label="toolbar"
                orientation="horizontal"
            >
                <Toolbar.Button
                    className="toolbar-button"
                    onClick={() => downloadDoc(editorView.current)}
                >
                    <DownloadIcon />
                </Toolbar.Button>
                <Toolbar.Button
                    className="toolbar-button"
                    onClick={() => undoCommand(editorView.current)}
                >
                    <ArrowLeftIcon />
                </Toolbar.Button>
                <Toolbar.Button
                    className="toolbar-button"
                    onClick={() => redoCommand(editorView.current)}
                >
                    <ArrowRightIcon />
                </Toolbar.Button>
                <Toolbar.Separator
                    className="toolbar-separator"
                    orientation="horizontal"
                />

                <Toolbar.ToggleGroup
                    type="multiple"
                    aria-label="bold formatting"
                >
                    <Toolbar.ToggleItem
                        className="toolbar-toggle-item"
                        value="bold"
                        aria-label="bold"
                        onClick={() => {
                            toggle(editorView.current, 'bold');
                        }}
                    >
                        <FontBoldIcon />
                    </Toolbar.ToggleItem>
                    <Toolbar.ToggleItem
                        className="toolbar-toggle-item"
                        value="italic"
                        aria-label="italic"
                        onClick={() => toggle(editorView.current, 'italic')}
                    >
                        <FontItalicIcon />
                    </Toolbar.ToggleItem>
                    <Toolbar.ToggleItem
                        className="toolbar-toggle-item"
                        value="underline"
                        aria-label="underline"
                        onClick={() => toggle(editorView.current, 'underline')}
                    >
                        <UnderlineIcon />
                    </Toolbar.ToggleItem>

                    <Toolbar.ToggleItem
                        className="toolbar-toggle-item"
                        value="strikethrough"
                        aria-label="strikethrough"
                        onClick={() =>
                            toggle(editorView.current, 'strikethrough')
                        }
                    >
                        <StrikethroughIcon />
                    </Toolbar.ToggleItem>
                </Toolbar.ToggleGroup>
                <Toolbar.Separator
                    className="toolbar-separator"
                    orientation="horizontal"
                />
                <Toolbar.Button
                    className="toolbar-button"
                    onClick={() => setBlock(editorView.current, 'para')}
                >
                    <PilcrowIcon />
                </Toolbar.Button>
                <Toolbar.Button
                    className="toolbar-button"
                    onClick={() => wrapInBlockquote(editorView.current)}
                >
                    <QuoteIcon />
                </Toolbar.Button>
                <Toolbar.Button
                    className="toolbar-button"
                    onClick={() => wrapInListCommand(editorView.current)}
                >
                    <ListBulletIcon />
                </Toolbar.Button>

                <DropdownMenu.Root>
                    <Toolbar.Button asChild>
                        <DropdownMenu.Trigger>Heading</DropdownMenu.Trigger>
                    </Toolbar.Button>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item
                            onClick={() =>
                                setHeadingLevel(editorView.current, 1)
                            }
                        >
                            Heading One
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            onClick={() =>
                                setHeadingLevel(editorView.current, 2)
                            }
                        >
                            Heading Two
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            onClick={() =>
                                setHeadingLevel(editorView.current, 3)
                            }
                        >
                            Heading Three
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </Toolbar.Root>
        </>
    );
};

export default EditorToolbar;
