import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Toolbar from "@radix-ui/react-toolbar";
import { TrashIcon } from "@radix-ui/react-icons";

import "./DeleteButton.css";

const DeleteButton = ({ handler, ICON_PROPS }) => {
    return (
        <AlertDialog.Root>
            <Toolbar.Button title="delete" asChild className="toolbar-button">
                <AlertDialog.Trigger>
                    <TrashIcon
                        viewBox={ICON_PROPS.viewBox}
                        width={ICON_PROPS.width}
                        height={ICON_PROPS.width}
                    />
                </AlertDialog.Trigger>
            </Toolbar.Button>
            <AlertDialog.Overlay className="alert-dialog-overlay" />
            <AlertDialog.Content className="alert-dialog-content">
                <AlertDialog.Title className="alert-dialog-title">
                    Are you absolutely sure?
                </AlertDialog.Title>
                <AlertDialog.Description className="alert-dialog-description">
                    This action cannot be undone. This will permanently delete
                    your document and remove your versions from local storage.
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
                            Yes, delete document
                        </button>
                    </AlertDialog.Action>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

export default DeleteButton;
