import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./RestoreVersionButton.css";

const RestoreVersionButton = ({ restoreVersion, versionID }) => {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger className="alert-trigger" title="restore">
                <FontAwesomeIcon icon={faRepeat} size="xl" />
            </AlertDialog.Trigger>
            <AlertDialog.Overlay className="alert-dialog-overlay" />
            <AlertDialog.Content className="alert-dialog-content">
                <AlertDialog.Title className="alert-dialog-title">
                    Restore a Version
                </AlertDialog.Title>
                <AlertDialog.Description className="alert-dialog-description">
                    This will restore the version and overwrite your current
                    document. Any unsaved changes in your document will be lost.
                    If you would like to save those changes please cancel and
                    save before restoring.
                </AlertDialog.Description>

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
                                restoreVersion(versionID);
                            }}
                            className="button green"
                        >
                            Restore Version
                        </button>
                    </AlertDialog.Action>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

export default RestoreVersionButton;
