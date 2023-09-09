import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { TrashIcon } from "@radix-ui/react-icons";

const VersionDeleteButton = ({ handler, versionID, ICON_PROPS }) => {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger
                title="delete version"
                className="alert-trigger"
            >
                <TrashIcon
                    viewBox={ICON_PROPS.viewBox}
                    width={ICON_PROPS.width}
                    height={ICON_PROPS.width}
                />
            </AlertDialog.Trigger>
            <AlertDialog.Overlay className="alert-dialog-overlay" />
            <AlertDialog.Content className="alert-dialog-content">
                <AlertDialog.Title className="alert-dialog-title">
                    Are you absolutely sure?
                </AlertDialog.Title>
                <AlertDialog.Description className="alert-dialog-description">
                    This action cannot be undone. This will permanently delete
                    your version from local storage. You can only recover it if
                    a colleague shares it again.
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
                            onClick={() => handler(versionID)}
                            className="button red"
                        >
                            Yes, delete version
                        </button>
                    </AlertDialog.Action>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};
export default VersionDeleteButton;
