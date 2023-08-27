import { useSelector } from 'react-redux/es/hooks/useSelector';

import * as Tabs from '@radix-ui/react-tabs';

import './VersionsMenu.css';
import { RootState } from '../../../state/store';
import VersionCard from './VersionCard';

const versionsSelector = (state: RootState) => state.editor.versions;
const userIDSelector = (state: RootState) => state.user.peciaID;

const timestamp = (createdAtNumber: number) =>
    new Date(createdAtNumber).toLocaleString();

const VersionsMenu = () => {
    const versions = useSelector(versionsSelector);
    const userID = useSelector(userIDSelector);

    const myVersions = versions.filter((version) => version.owner === userID);
    const colleagueVersions = versions.filter(
        (version) => version.owner !== userID
    );

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
                    {myVersions &&
                        myVersions.map((version) => (
                            <VersionCard
                                key={version.id}
                                label={version.label}
                                id={version.id}
                                description={version.description}
                                title={version.title}
                                created={timestamp(version.localCreationTime)}
                            />
                        ))}
                </Tabs.Content>
                <Tabs.Content className="tabs-content" value="tab2">
                    {colleagueVersions &&
                        colleagueVersions.map((version) => (
                            <VersionCard
                                key={version.id}
                                label={version.label}
                                id={version.id}
                                description={version.description}
                                title={version.title}
                                created={timestamp(version.localCreationTime)}
                            />
                        ))}
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
};

export default VersionsMenu;
