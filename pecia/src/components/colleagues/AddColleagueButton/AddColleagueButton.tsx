import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./AddColleagueButton.css";
import { useState } from "react";

const AddColleagueButton = ({ handler }) => {
    const [username, setUsername] = useState("");
    const [passcode, setPasscode] = useState("");
    const [peciaID, setPeciaID] = useState("");

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger title="add colleague">
                <FontAwesomeIcon icon={faPlus} size="xl" />
            </AlertDialog.Trigger>
            <AlertDialog.Overlay className="alert-dialog-overlay" />
            <AlertDialog.Content className="alert-dialog-content">
                <AlertDialog.Title className="alert-dialog-title">
                    Add a Colleague
                </AlertDialog.Title>
                <AlertDialog.Description className="alert-dialog-description">
                    Add a colleague to your colleague list. From there you can
                    connect with them and share documents.
                </AlertDialog.Description>
                <div className="input-container">
                    <label className="alert-dialog-label" htmlFor="title">
                        Username:{" "}
                    </label>
                    <input
                        value={username}
                        name="username"
                        title="username"
                        onChange={(e) => setUsername(e.target.value)}
                        className="alert-dialog-input"
                    />
                </div>
                <div className="input-container">
                    <label className="alert-dialog-label" htmlFor="description">
                        Passcode:{" "}
                    </label>
                    <input
                        value={passcode}
                        name="passcode"
                        title="passcode"
                        onChange={(e) => setPasscode(e.target.value)}
                        className="alert-dialog-input"
                    />
                </div>
                <div className="input-container">
                    <label className="alert-dialog-label" htmlFor="description">
                        Pecia ID:{" "}
                    </label>
                    <input
                        value={peciaID}
                        name="peciaID"
                        title="pecia ID"
                        onChange={(e) => setPeciaID(e.target.value)}
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
                        <button className="button" title="cancel">
                            Cancel
                        </button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                        <button
                            onClick={() => {
                                handler(username, passcode, peciaID);
                                setUsername("");
                                setPasscode("");
                                setPeciaID("");
                            }}
                            className="button green"
                            title="confirm"
                            disabled={!username || !passcode || !peciaID}
                        >
                            Add Colleague
                        </button>
                    </AlertDialog.Action>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

export default AddColleagueButton;
