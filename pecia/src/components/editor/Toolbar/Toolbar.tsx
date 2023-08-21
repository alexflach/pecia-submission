import { EditorView } from 'prosemirror-view';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../state/store';
import {
    toggle,
    setBlock,
    wrapInBlockquote,
    downloadDoc,
    saveDoc,
    undoCommand,
    redoCommand,
    wrapInListCommand,
    setHeadingLevel,
    deleteDoc,
} from './commands';

import * as Toolbar from '@radix-ui/react-toolbar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    BookmarkIcon,
    DownloadIcon,
    FontBoldIcon,
    FontItalicIcon,
    StrikethroughIcon,
    UnderlineIcon,
    PilcrowIcon,
    QuoteIcon,
    ListBulletIcon,
    TrashIcon,
} from '@radix-ui/react-icons';

import './Toolbar.css';
import { useNavigate } from 'react-router-dom';

interface toolbarProps {
    editorView: React.MutableRefObject<EditorView>;
}

const ICON_PROPS = {
    viewBox: '0 0 15 15',
    width: 25,
    height: 25,
};

const EditorToolbar = ({ editorView }: toolbarProps) => {
    const { currentDocID } = useSelector((state: RootState) => state.editor);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div className="toolbar">
            <Toolbar.Root
                className="toolbar-root"
                aria-label="toolbar"
                orientation="horizontal"
            >
                <Toolbar.Button
                    className="toolbar-button"
                    onClick={() => downloadDoc(editorView.current)}
                >
                    <DownloadIcon
                        viewBox={ICON_PROPS.viewBox}
                        width={ICON_PROPS.width}
                        height={ICON_PROPS.width}
                    />
                </Toolbar.Button>
                <Toolbar.Button
                    className="toolbar-button"
                    onClick={() => saveDoc(editorView.current, currentDocID)}
                >
                    <BookmarkIcon
                        viewBox={ICON_PROPS.viewBox}
                        width={ICON_PROPS.width}
                        height={ICON_PROPS.width}
                    />
                </Toolbar.Button>
                <Toolbar.Button
                    className="toolbar-button"
                    onClick={() => deleteDoc(currentDocID, dispatch, navigate)}
                >
                    <TrashIcon
                        viewBox={ICON_PROPS.viewBox}
                        width={ICON_PROPS.width}
                        height={ICON_PROPS.width}
                    />
                </Toolbar.Button>

                <Toolbar.Button
                    className="toolbar-button"
                    onClick={() => undoCommand(editorView.current)}
                >
                    <ArrowLeftIcon
                        viewBox={ICON_PROPS.viewBox}
                        width={ICON_PROPS.width}
                        height={ICON_PROPS.width}
                    />
                </Toolbar.Button>
                <Toolbar.Button
                    className="toolbar-button"
                    onClick={() => redoCommand(editorView.current)}
                >
                    <ArrowRightIcon
                        viewBox={ICON_PROPS.viewBox}
                        width={ICON_PROPS.width}
                        height={ICON_PROPS.width}
                    />
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
                        <FontBoldIcon
                            viewBox={ICON_PROPS.viewBox}
                            width={ICON_PROPS.width}
                            height={ICON_PROPS.width}
                        />
                    </Toolbar.ToggleItem>
                    <Toolbar.ToggleItem
                        className="toolbar-toggle-item"
                        value="italic"
                        aria-label="italic"
                        onClick={() => toggle(editorView.current, 'italic')}
                    >
                        <FontItalicIcon
                            viewBox={ICON_PROPS.viewBox}
                            width={ICON_PROPS.width}
                            height={ICON_PROPS.width}
                        />
                    </Toolbar.ToggleItem>
                    <Toolbar.ToggleItem
                        className="toolbar-toggle-item"
                        value="underline"
                        aria-label="underline"
                        onClick={() => toggle(editorView.current, 'underline')}
                    >
                        <UnderlineIcon
                            viewBox={ICON_PROPS.viewBox}
                            width={ICON_PROPS.width}
                            height={ICON_PROPS.width}
                        />
                    </Toolbar.ToggleItem>

                    <Toolbar.ToggleItem
                        className="toolbar-toggle-item"
                        value="strikethrough"
                        aria-label="strikethrough"
                        onClick={() =>
                            toggle(editorView.current, 'strikethrough')
                        }
                    >
                        <StrikethroughIcon
                            viewBox={ICON_PROPS.viewBox}
                            width={ICON_PROPS.width}
                            height={ICON_PROPS.width}
                        />
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
                    <PilcrowIcon
                        viewBox={ICON_PROPS.viewBox}
                        width={ICON_PROPS.width}
                        height={ICON_PROPS.width}
                    />
                </Toolbar.Button>
                <Toolbar.Button
                    className="toolbar-button"
                    onClick={() => wrapInBlockquote(editorView.current)}
                >
                    <QuoteIcon
                        viewBox={ICON_PROPS.viewBox}
                        width={ICON_PROPS.width}
                        height={ICON_PROPS.width}
                    />
                </Toolbar.Button>
                <Toolbar.Button
                    className="toolbar-button"
                    onClick={() => wrapInListCommand(editorView.current)}
                >
                    <ListBulletIcon
                        viewBox={ICON_PROPS.viewBox}
                        width={ICON_PROPS.width}
                        height={ICON_PROPS.width}
                    />
                </Toolbar.Button>

                <DropdownMenu.Root>
                    <Toolbar.Button asChild>
                        <DropdownMenu.Trigger className="h4">
                            Heading
                        </DropdownMenu.Trigger>
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
        </div>
    );
};

export default EditorToolbar;
