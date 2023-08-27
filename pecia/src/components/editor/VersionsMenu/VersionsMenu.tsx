import * as Tabs from '@radix-ui/react-tabs';

import './VersionsMenu.css';

const VersionsMenu = () => {
    return (
        <div className="versions-wrapper">
            <h5 className="versions-header">Versions</h5>
            <Tabs.Root className="tabs-root" defaultValue="tab1">
                <Tabs.List
                    className="tabs-list"
                    aria-label="Browse Your Versions"
                >
                    <Tabs.Trigger className="tabs-trigger" value="tab1">
                        Your Versions
                    </Tabs.Trigger>
                    <Tabs.Trigger className="tabs-trigger" value="tab2">
                        Colleague Versions
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content className="tabs-content" value="tab1">
                    <ul>
                        <li>version 1</li>

                        <li>version 2</li>
                    </ul>
                </Tabs.Content>
                <Tabs.Content className="tabs-content" value="tab2">
                    <ul>
                        <li>version 1</li>

                        <li>version 2</li>
                    </ul>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
};

export default VersionsMenu;
