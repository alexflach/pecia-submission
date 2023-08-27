import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { faShareFromSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import './ShareVersionButton.css';

const ShareVersionButton = ({ shareVersion, versionID }) => {
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
                    This will share the version with all colleagues currently
                    connected to this document.
                </AlertDialog.Description>

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
                                shareVersion(versionID);
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
