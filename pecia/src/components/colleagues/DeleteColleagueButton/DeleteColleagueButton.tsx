import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DeleteColleagueButton = ({ handler }) => {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger
                title="delete colleague"
                className="alert-trigger"
            >
                <FontAwesomeIcon icon={faTrashCan} size={"xl"} />
            </AlertDialog.Trigger>
            <AlertDialog.Overlay className="alert-dialog-overlay" />
            <AlertDialog.Content className="alert-dialog-content">
                <AlertDialog.Title className="alert-dialog-title">
                    Are you absolutely sure?
                </AlertDialog.Title>
                <AlertDialog.Description className="alert-dialog-description">
                    This action cannot be undone. This will permanently delete
                    your colleague from local storage. You will need to add them
                    again to restore document sharing.
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
                        <button onClick={handler} className="button red">
                            Yes, delete colleague
                        </button>
                    </AlertDialog.Action>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};
export default DeleteColleagueButton;
