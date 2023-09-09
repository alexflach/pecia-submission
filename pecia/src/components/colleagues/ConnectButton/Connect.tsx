import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Connect.css";
import { useState } from "react";

const ConnectButton = ({ handler }) => {
    const [peerID, setPeerID] = useState("");

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger title="connect" className="alert-trigger">
                <FontAwesomeIcon icon={faLink} size="xl" />
            </AlertDialog.Trigger>
            <AlertDialog.Overlay className="alert-dialog-overlay" />
            <AlertDialog.Content className="alert-dialog-content">
                <AlertDialog.Title className="alert-dialog-title">
                    Connect
                </AlertDialog.Title>
                <AlertDialog.Description className="alert-dialog-description">
                    Enter your colleague's connection id to try to connect.
                </AlertDialog.Description>
                <div className="input-container">
                    <label className="alert-dialog-label" htmlFor="peerID">
                        Connection ID:{" "}
                    </label>
                    <input
                        value={peerID}
                        name="peerID"
                        onChange={(e) => setPeerID(e.target.value)}
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
                        <button title="cancel" className="button">
                            Cancel
                        </button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                        <button
                            title="connect"
                            onClick={() => {
                                handler(peerID);
                                setPeerID("");
                            }}
                            className="button green"
                            disabled={!peerID}
                        >
                            Connect
                        </button>
                    </AlertDialog.Action>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

export default ConnectButton;
