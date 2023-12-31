import { useDispatch } from "react-redux";
import { actions } from "../../../state/slices/peer";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { UserMessage } from "../../../state/slices/peer/peerReducers.ts";
import "./ColleagueMessage.css";

const ColleagueMessage = ({ message }: { message: UserMessage }) => {
    const dispatch = useDispatch();
    const timeString = new Date(message.timestamp).toLocaleString();
    return (
        <div className="colleague-message">
            <div className="message-summary">{message.summary}</div>
            <div className="message-action">
                <AlertDialog.Root>
                    <AlertDialog.Trigger asChild className="alert-trigger">
                        <button title="details" className="button">
                            See Details
                        </button>
                    </AlertDialog.Trigger>
                    <AlertDialog.Overlay className="alert-dialog-overlay" />
                    <AlertDialog.Content className="alert-dialog-content">
                        <AlertDialog.Title className="alert-dialog-title">
                            {message.summary}
                        </AlertDialog.Title>
                        <AlertDialog.Description className="alert-dialog-description">
                            {message.message}
                        </AlertDialog.Description>

                        <div className="timestamp">
                            <p className="timestamp">{timeString}</p>
                        </div>
                        <div className="message-handlers">
                            <AlertDialog.Cancel asChild>
                                <button className="button">Cancel</button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                                <button
                                    onClick={() => {
                                        dispatch(
                                            actions.resolveMessage(
                                                message.rejection,
                                                message,
                                            ),
                                        );
                                    }}
                                    className="button red"
                                    title="reject"
                                >
                                    Reject
                                </button>
                            </AlertDialog.Action>
                            <AlertDialog.Action asChild>
                                <button
                                    onClick={() => {
                                        dispatch(
                                            actions.resolveMessage(
                                                message.action,
                                                message,
                                            ),
                                        );
                                    }}
                                    className="button green"
                                    title="approve"
                                >
                                    Approve
                                </button>
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Root>
            </div>
        </div>
    );
};

export default ColleagueMessage;
