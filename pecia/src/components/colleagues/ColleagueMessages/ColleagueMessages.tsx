import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import ColleagueMessage from "../ColleagueMessage";
import { actions } from "../../../state/slices/peer";

import "./ColleagueMessages.css";

const selector = (state: RootState) => state.peer;
const MessagesPanel = () => {
    const dispatch = useDispatch();
    const { showMessages, messages } = useSelector(selector);

    return (
        <div
            className="messages-container"
            data-state={showMessages ? "active" : "inactive"}
        >
            {messages &&
                messages.map((message) => (
                    <ColleagueMessage key={message.id} message={message}>
                        {message.message}
                    </ColleagueMessage>
                ))}
            <div className="messages-header">
                <h5>Colleague Notifications</h5>
                <button onClick={() => dispatch(actions.toggleMessages())}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default MessagesPanel;
