import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './CreateVersion.css';
import { useState } from 'react';

const CreateVersionButton = ({ createVersion }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <FontAwesomeIcon icon={faPlus} size="xl" />
            </AlertDialog.Trigger>
            <AlertDialog.Overlay className="alert-dialog-overlay" />
            <AlertDialog.Content className="alert-dialog-content">
                <AlertDialog.Title className="alert-dialog-title">
                    Create a Version
                </AlertDialog.Title>
                <AlertDialog.Description className="alert-dialog-description">
                    This will create a version that you can share with
                    colleagues. Versions can be merged and restored at any time.
                </AlertDialog.Description>
                <div className="input-container">
                    <label className="alert-dialog-label" htmlFor="title">
                        Version Label:{' '}
                    </label>
                    <input
                        value={title}
                        name="title"
                        onChange={(e) => setTitle(e.target.value)}
                        className="alert-dialog-input"
                    />
                </div>
                <div className="input-container">
                    <label className="alert-dialog-label" htmlFor="description">
                        Version Description:{' '}
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
                                createVersion(title, description);
                                setTitle('');
                                setDescription('');
                            }}
                            className="button green"
                            disabled={!title || !description}
                        >
                            Create Version
                        </button>
                    </AlertDialog.Action>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

export default CreateVersionButton;
