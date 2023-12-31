import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../state/store";
import { actions } from "../../../../state/slices/editor";
import { actions as toastActions } from "../../../../state/slices/toast";
import { actions as peerActions } from "../../../../state/slices/peer";
import * as Collapsible from "@radix-ui/react-collapsible";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VersionDeleteButton from "../VersionDeleteButton";
import RestoreVersionButton from "../RestoreVersionButton";
import ShareVersionButton from "../ShareVersionButton";
import MergeVersionButton from "../MergeVersionButton";

import "./VersionCard.css";
import { Replica } from "../../../../lib/crdt/replica.ts";
import { DataConnection } from "peerjs";

export interface VersionCardProps {
    versionID: string;
    label: string;
    created: string;
    description: string;
    active: boolean;
}
const ICON_PROPS = {
    viewBox: "0 0 15 15",
    width: 20,
    height: 20,
};

const VersionCard = ({
    versionID,
    description,
    label,
    created,
    active,
}: VersionCardProps) => {
    const dispatch = useDispatch();
    const { versions, currentDocID, currentVersionID, currentVersionLabel } =
        useSelector((state: RootState) => state.editor);
    const [open, setOpen] = useState(false);
    const handleDelete = (id: string) => {
        dispatch(actions.deleteVersion(id));
        try {
            localStorage.setItem(
                `pecia-versions-${currentDocID}`,
                JSON.stringify(versions),
            );
        } catch (error) {
            console.error(error);
            dispatch(
                toastActions.addToast(
                    "failed to save, are you out of storage?",
                    "error",
                ),
            );
        }
    };
    const restoreVersion = (id: string) => {
        dispatch(actions.restoreVersionPrep(id));
    };

    const mergeVersions = (
        version1ID: string,
        version2ID: string,
        label: string,
        description: string,
    ) => {
        dispatch(
            actions.mergeVersions(version1ID, version2ID, label, description),
        );
    };
    const shareVersion = (version: Replica, connections: DataConnection[]) => {
        dispatch(peerActions.shareVersion({ version, connections }));
    };
    return (
        <div
            className="card-container"
            data-active={active}
            data-version-id={versionID}
        >
            <Collapsible.Root
                className="collapsible-root"
                open={open}
                onOpenChange={setOpen}
            >
                <Collapsible.Trigger asChild>
                    <div className="card-header">
                        <span className="label">{label}</span>
                        <button className="card-button">
                            {
                                <FontAwesomeIcon
                                    icon={open ? faChevronUp : faChevronDown}
                                />
                            }
                        </button>
                    </div>
                </Collapsible.Trigger>
                <Collapsible.Content>
                    <p className="description">{description}</p>
                    <span className="timestamp">{created}</span>
                    <div className="card-actions">
                        {!(currentVersionID === versionID) && (
                            <VersionDeleteButton
                                handler={handleDelete}
                                ICON_PROPS={ICON_PROPS}
                                versionID={versionID}
                            />
                        )}
                        <RestoreVersionButton
                            versionID={versionID}
                            restoreVersion={restoreVersion}
                        />
                        <ShareVersionButton
                            versionID={versionID}
                            shareVersion={shareVersion}
                        />
                        {!active && (
                            <MergeVersionButton
                                handler={mergeVersions}
                                version1Label={label}
                                version1ID={versionID}
                                version2Label={currentVersionLabel}
                                version2ID={currentVersionID}
                            />
                        )}
                    </div>
                </Collapsible.Content>
            </Collapsible.Root>
        </div>
    );
};
export default VersionCard;
