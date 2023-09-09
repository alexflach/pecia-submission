import { EditorView } from "prosemirror-view";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../state/store";
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
} from "./commands";

import * as Toolbar from "@radix-ui/react-toolbar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
    DownloadIcon,
    FontBoldIcon,
    FontItalicIcon,
    StrikethroughIcon,
    UnderlineIcon,
    PilcrowIcon,
    QuoteIcon,
    ListBulletIcon,
} from "@radix-ui/react-icons";

import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import {
    faArrowRotateLeft,
    faArrowRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Toolbar.css";
import { useNavigate } from "react-router-dom";
import DeleteButton from "./DeleteButton";

interface toolbarProps {
    editorView: React.MutableRefObject<EditorView>;
}

const ICON_PROPS = {
    viewBox: "0 0 15 15",
    width: 20,
    height: 20,
};

const EditorToolbar = ({ editorView }: toolbarProps) => {
    const { currentDocID, versions, title } = useSelector(
        (state: RootState) => state.editor,
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const deleteHandler = () => {
        deleteDoc(currentDocID, dispatch, navigate);
    };
    return (
        <div className="toolbar">
            <Toolbar.Root
                className="toolbar-root"
                aria-label="toolbar"
                orientation="horizontal"
            >
                <DeleteButton handler={deleteHandler} ICON_PROPS={ICON_PROPS} />
                <Toolbar.Button
                    title="download"
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
                    title="save"
                    onClick={() =>
                        saveDoc(
                            editorView.current,
                            currentDocID,
                            dispatch,
                            versions,
                            title,
                        )
                    }
                >
                    <FontAwesomeIcon icon={faFloppyDisk} size="xl" />
                </Toolbar.Button>
                <Toolbar.Button
                    className="toolbar-button"
                    title="undo"
                    onClick={() => undoCommand(editorView.current)}
                >
                    <FontAwesomeIcon icon={faArrowRotateLeft} size="xl" />
                </Toolbar.Button>
                <Toolbar.Button
                    className="toolbar-button"
                    title="redo"
                    onClick={() => redoCommand(editorView.current)}
                >
                    <FontAwesomeIcon icon={faArrowRotateRight} size="xl" />
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
                        title="bold"
                        onClick={() => {
                            toggle(editorView.current, "bold");
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
                        title="italic"
                        aria-label="italic"
                        onClick={() => toggle(editorView.current, "italic")}
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
                        title="underline"
                        aria-label="underline"
                        onClick={() => toggle(editorView.current, "underline")}
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
                        title="strikethrough"
                        onClick={() =>
                            toggle(editorView.current, "strikethrough")
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
                    title="paragraph style"
                    onClick={() => setBlock(editorView.current, "para")}
                >
                    <PilcrowIcon
                        viewBox={ICON_PROPS.viewBox}
                        width={ICON_PROPS.width}
                        height={ICON_PROPS.width}
                    />
                </Toolbar.Button>
                <Toolbar.Button
                    className="toolbar-button"
                    title="blockquote"
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
                    title="list"
                    onClick={() => wrapInListCommand(editorView.current)}
                >
                    <ListBulletIcon
                        viewBox={ICON_PROPS.viewBox}
                        width={ICON_PROPS.width}
                        height={ICON_PROPS.width}
                    />
                </Toolbar.Button>

                <DropdownMenu.Root>
                    <Toolbar.Button title="heading level" asChild>
                        <DropdownMenu.Trigger className="h4">
                            Heading
                        </DropdownMenu.Trigger>
                    </Toolbar.Button>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item
                            className="dropdown-item"
                            onClick={() =>
                                setHeadingLevel(editorView.current, 1)
                            }
                        >
                            Heading One
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            className="dropdown-item"
                            onClick={() =>
                                setHeadingLevel(editorView.current, 2)
                            }
                        >
                            Heading Two
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            className="dropdown-item"
                            onClick={() =>
                                setHeadingLevel(editorView.current, 3)
                            }
                        >
                            Heading Three
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            className="dropdown-item"
                            onClick={() =>
                                setHeadingLevel(editorView.current, 4)
                            }
                        >
                            Heading Four
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            className="dropdown-item"
                            onClick={() =>
                                setHeadingLevel(editorView.current, 5)
                            }
                        >
                            Heading Five
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </Toolbar.Root>
        </div>
    );
};

export default EditorToolbar;
