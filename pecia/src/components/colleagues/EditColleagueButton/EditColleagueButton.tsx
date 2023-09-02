import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './EditColleagueButton.css';
import { useState } from 'react';

const EditColleagueButton = ({ handler, colleague }) => {
    const [username, setUsername] = useState(colleague.username);
    const [passcode, setPasscode] = useState(colleague.passcode);
    const [peciaID, setPeciaID] = useState(colleague.peciaID);

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger className="alert-trigger">
                <FontAwesomeIcon icon={faPenToSquare} size="xl" />
            </AlertDialog.Trigger>
            <AlertDialog.Overlay className="alert-dialog-overlay" />
            <AlertDialog.Content className="alert-dialog-content">
                <AlertDialog.Title className="alert-dialog-title">
                    Edit Colleague
                </AlertDialog.Title>
                <AlertDialog.Description className="alert-dialog-description">
                    Edit your colleague's details.
                </AlertDialog.Description>
                <div className="input-container">
                    <label className="alert-dialog-label" htmlFor="title">
                        Username:{' '}
                    </label>
                    <input
                        value={username}
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                        className="alert-dialog-input"
                    />
                </div>
                <div className="input-container">
                    <label className="alert-dialog-label" htmlFor="description">
                        Passcode:{' '}
                    </label>
                    <input
                        value={passcode}
                        name="passcode"
                        onChange={(e) => setPasscode(e.target.value)}
                        className="alert-dialog-input"
                    />
                </div>
                <div className="input-container">
                    <label className="alert-dialog-label" htmlFor="description">
                        Pecia ID:{' '}
                    </label>
                    <input
                        value={peciaID}
                        name="peciaID"
                        onChange={(e) => setPeciaID(e.target.value)}
                        className="alert-dialog-input"
                    />
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: 25,
                        justifyContent: 'flex-end',
                    }}
                >
                    <AlertDialog.Cancel asChild>
                        <button className="button">Cancel</button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                        <button
                            onClick={() => {
                                handler(username, passcode, peciaID);
                            }}
                            className="button green"
                            disabled={(!username || !passcode || !peciaID)}
                        >
                            Update Colleague
                        </button>
                    </AlertDialog.Action>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

export default EditColleagueButton;
