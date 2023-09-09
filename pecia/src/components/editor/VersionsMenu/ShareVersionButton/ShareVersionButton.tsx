import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { faShareFromSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePeerContext } from "../../../../hooks/usePeer.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../../../state/store.ts";

const ShareVersionButton = ({ shareVersion, versionID }) => {
    const { connections } = usePeerContext();
    const versions = useSelector((state: RootState) => state.editor.versions);
    const colleagues = useSelector((state: RootState) => state.peer.colleagues);
    const currentDocID = useSelector(
        (state: RootState) => state.editor.currentDocID,
    );
    const matchedVersion = versions.find((v) => v.versionID === versionID);
    const matchedColleagues = colleagues.filter(
        (colleague) =>
            colleague.connectionStatus === "CONNECTED" &&
            colleague.docs.find((doc) => doc === currentDocID),
    );

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger className="alert-trigger">
                <FontAwesomeIcon icon={faShareFromSquare} size="xl" />
            </AlertDialog.Trigger>
            <AlertDialog.Overlay className="alert-dialog-overlay" />
            <AlertDialog.Content className="alert-dialog-content">
                <AlertDialog.Title className="alert-dialog-title">
                    Share a Version
                </AlertDialog.Title>
                <AlertDialog.Description className="alert-dialog-description">
                    You will share the version with all colleagues currently
                    connected to this document.
                </AlertDialog.Description>
                {matchedColleagues.length ? (
                    <div className="colleague-list">
                        {matchedColleagues.map((colleague) => (
                            <p>- {colleague.username}</p>
                        ))}
                    </div>
                ) : (
                    <p>Not sharing with any colleagues online</p>
                )}

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
                                shareVersion(
                                    matchedVersion,
                                    connections.current,
                                );
                            }}
                            className="button green"
                        >
                            Share Version
                        </button>
                    </AlertDialog.Action>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

export default ShareVersionButton;
