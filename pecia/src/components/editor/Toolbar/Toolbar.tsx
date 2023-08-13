import { toggleMark } from 'prosemirror-commands';

import * as Toolbar from '@radix-ui/react-toolbar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import schema from '../../../lib/editor/schema';

import {
    FontBoldIcon,
    FontItalicIcon,
    StrikethroughIcon,
} from '@radix-ui/react-icons';

import './Toolbar.css';
import { EditorView } from 'prosemirror-view';

interface toolbarProps {
    editorView: React.MutableRefObject<EditorView>;
}

const EditorToolbar = ({ editorView }: toolbarProps) => {
    const toggle = (markType) => {
        if (!editorView.current) return;
        toggleMark(markType)(
            editorView.current.state,
            editorView.current.dispatch
        );
        editorView.current.focus();
    };
    return (
        <>
            <Toolbar.Root
                className="toolbar-root"
                aria-label="toolbar"
                orientation="horizontal"
            >
                <Toolbar.ToggleGroup
                    type="multiple"
                    aria-label="bold formatting"
                >
                    <Toolbar.ToggleItem
                        className="toolbar-toggle-item"
                        value="bold"
                        aria-label="bold"
                        onClick={() => {
                            toggle(schema.marks.bold);
                        }}
                    >
                        <FontBoldIcon />
                    </Toolbar.ToggleItem>
                    <Toolbar.ToggleItem
                        className="toolbar-toggle-item"
                        value="italic"
                        aria-label="italic"
                        onClick={() => toggle(schema.marks.italic)}
                    >
                        <FontItalicIcon />
                    </Toolbar.ToggleItem>
                    <Toolbar.ToggleItem
                        className="toolbar-toggle-item"
                        value="strikethrough"
                        aria-label="strikethrough"
                        onClick={() => toggle(schema.marks.strikethrough)}
                    >
                        <StrikethroughIcon />
                    </Toolbar.ToggleItem>
                </Toolbar.ToggleGroup>
                <Toolbar.Separator
                    className="toolbar-separator"
                    orientation="horizontal"
                />
                <DropdownMenu.Root>
                    <Toolbar.Button asChild>
                        <DropdownMenu.Trigger>Trigger</DropdownMenu.Trigger>
                    </Toolbar.Button>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item
                            onClick={() => console.log('clicked item one')}
                        >
                            Item One
                        </DropdownMenu.Item>
                        <DropdownMenu.Item>Item Two</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </Toolbar.Root>
        </>
    );
};

export default EditorToolbar;
