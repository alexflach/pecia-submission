import { useSelector, useDispatch } from "react-redux";
import * as Tabs from "@radix-ui/react-tabs";

import "./VersionsMenu.css";
import { RootState } from "../../../state/store";
import VersionCard from "./VersionCard";
import { actions as toastActions } from "../../../state/slices/toast";
import { actions as editorActions } from "../../../state/slices/editor";

import CreateVersionButton from "./CreateVersionButton";

const versionsSelector = (state: RootState) => state.editor.versions;
const userIDSelector = (state: RootState) => state.user.peciaID;
const docsSelector = (state: RootState) => state.docs.docs;
const docIDSelector = (state: RootState) => state.editor.currentDocID;
const versionIDSelector = (state: RootState) => state.editor.currentVersionID;

const timestamp = (createdAtNumber: number) =>
    new Date(createdAtNumber).toLocaleString();

const VersionsMenu = () => {
    const dispatch = useDispatch();
    const versions = useSelector(versionsSelector);
    const userID = useSelector(userIDSelector);
    const currentDocID = useSelector(docIDSelector);
    const currentVersionID = useSelector(versionIDSelector);

    const docTitleArray = useSelector(docsSelector)
        .filter((doc) => doc.id === currentDocID)
        .map((doc) => doc.title);
    const docTitle = docTitleArray.length ? docTitleArray[0] : "Untitled";

    const myVersions = versions.filter((version) => version.owner === userID);
    const colleagueVersions = versions.filter(
        (version) => version.owner !== userID,
    );
    const createVersionHandler = (label: string, description: string) => {
        dispatch(
            editorActions.createVersion(userID, docTitle, label, description),
        );
        dispatch(toastActions.addToast(`version ${label} created!`, "info"));
    };

    return (
        <div className="versions-wrapper">
            <div className="versions-header">
                <h5 className="versions-title">Versions</h5>
                <CreateVersionButton createVersion={createVersionHandler} />
            </div>
            <Tabs.Root className="tabs-root" defaultValue="tab1">
                <Tabs.List
                    className="tabs-list"
                    aria-label="Browse Your Versions"
                >
                    <Tabs.Trigger
                        title="your versions"
                        className="tabs-trigger"
                        value="tab1"
                    >
                        Your Versions
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        title="colleague versions"
                        className="tabs-trigger"
                        value="tab2"
                    >
                        Colleague Versions
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content className="tabs-content" value="tab1">
                    {myVersions &&
                        myVersions.map((version) => (
                            <VersionCard
                                key={version.versionID}
                                label={version.label}
                                versionID={version.versionID}
                                description={version.description}
                                created={timestamp(version.localCreationTime)}
                                active={version.versionID === currentVersionID}
                            />
                        ))}
                </Tabs.Content>
                <Tabs.Content className="tabs-content" value="tab2">
                    {colleagueVersions &&
                        colleagueVersions.map((version) => (
                            <VersionCard
                                key={version.versionID}
                                label={version.label}
                                versionID={version.versionID}
                                description={version.description}
                                created={timestamp(version.localCreationTime)}
                                active={version.versionID === currentVersionID}
                            />
                        ))}
                    {!colleagueVersions.length && (
                        <h5>No colleague versions available</h5>
                    )}
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
};

export default VersionsMenu;
