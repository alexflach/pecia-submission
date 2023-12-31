import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { faCodeMerge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./MergeVersionButton.css";
import { useState } from "react";

const MergeVersionButton = ({
    handler,
    version1Label,
    version1ID,
    version2Label,
    version2ID,
}) => {
    const [label, setLabel] = useState("");
    const [description, setDescription] = useState("");

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger
                title="merge with current version"
                className="alert-trigger"
            >
                <FontAwesomeIcon icon={faCodeMerge} size="xl" />
            </AlertDialog.Trigger>
            <AlertDialog.Overlay className="alert-dialog-overlay" />
            <AlertDialog.Content className="alert-dialog-content">
                <AlertDialog.Title className="alert-dialog-title">
                    Merge a Version
                </AlertDialog.Title>
                <AlertDialog.Description
                    asChild
                    className="alert-dialog-description"
                >
                    <div className="alert-dialog-description">
                        <p>
                            This will create a new version of the document by
                            merging the changes from the following two versions:
                        </p>
                        <ul>
                            <li>{version1Label}</li>
                            <li>{version2Label}</li>
                        </ul>
                        <p>
                            Any unsaved changes to your document will be lost.
                            Are you sure?
                        </p>
                    </div>
                </AlertDialog.Description>
                <div className="input-container">
                    <label className="alert-dialog-label" htmlFor="title">
                        Version Label:{" "}
                    </label>
                    <input
                        value={label}
                        name="title"
                        onChange={(e) => setLabel(e.target.value)}
                        className="alert-dialog-input"
                    />
                </div>
                <div className="input-container">
                    <label className="alert-dialog-label" htmlFor="description">
                        Version Description:{" "}
                    </label>
                    <input
                        value={description}
                        name="description"
                        onChange={(e) => setDescription(e.target.value)}
                        className="alert-dialog-input"
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: 25,
                        justifyContent: "flex-end",
                    }}
                >
                    <AlertDialog.Cancel asChild>
                        <button className="button">Cancel</button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                        <button
                            onClick={() => {
                                handler(
                                    version1ID,
                                    version2ID,
                                    label,
                                    description,
                                );
                                setLabel("");
                                setDescription("");
                            }}
                            className="button green"
                            disabled={!label || !description}
                        >
                            Merge Versions
                        </button>
                    </AlertDialog.Action>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

export default MergeVersionButton;
