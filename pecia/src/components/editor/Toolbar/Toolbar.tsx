import { useDispatch } from 'react-redux';
import { actions } from '../../../state/slices/editor';

import * as Toolbar from '@radix-ui/react-toolbar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import {
    FontBoldIcon,
    FontItalicIcon,
    StrikethroughIcon,
} from '@radix-ui/react-icons';

import './Toolbar.css';

const EditorToolbar = () => {
    const dispatch = useDispatch();
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
                        onClick={() => dispatch(actions.toggleBold())}
                    >
                        <FontBoldIcon />
                    </Toolbar.ToggleItem>
                    <Toolbar.ToggleItem
                        className="toolbar-toggle-item"
                        value="italic"
                        aria-label="italic"
                        onClick={() => dispatch(actions.toggleItalic())}
                    >
                        <FontItalicIcon />
                    </Toolbar.ToggleItem>
                    <Toolbar.ToggleItem
                        className="toolbar-toggle-item"
                        value="strikethrough"
                        aria-label="strikethrough"
                        onClick={() => dispatch(actions.toggleStrikethrough())}
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
