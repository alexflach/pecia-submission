import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../state/store";
import { actions as toastActions } from "../../../state/slices/toast";
import { actions as peerActions } from "../../../state/slices/peer";
import {
    PersonIcon,
    CheckCircledIcon,
    ExclamationTriangleIcon,
    ValueIcon,
    InfoCircledIcon,
} from "@radix-ui/react-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";

import UserMenu from "./UserMenu";
import "./User.css";

const onlineSelector = (state: RootState) => state.user.online;
const toastsSelector = (state: RootState) => state.toast;
const peerSelector = (state: RootState) => state.peer;

const setInfoStatus = (
    showError: boolean,
    showWarning: boolean,
    toasts: number,
) => {
    if (showError) return "error";
    else if (showWarning) return "warning";
    else return toasts ? "info" : null;
};

const User = () => {
    const online = useSelector(onlineSelector);
    const { showWarning, showError, toasts } = useSelector(toastsSelector);
    const {
        showWarning: showPeerWarning,
        showError: showPeerError,
        messages,
    } = useSelector(peerSelector);
    const dispatch = useDispatch();

    const [showMenu, setShowMenu] = useState(false);

    const infoStatus = setInfoStatus(showError, showWarning, toasts.length);
    const peerInfoStatus = setInfoStatus(
        showPeerError,
        showPeerWarning,
        messages.length,
    );

    return (
        <div className="user-panel">
            <div className="info-logo">
                <button
                    title="colleague messages"
                    id="colleagues-button"
                    onClick={() => {
                        dispatch(peerActions.toggleMessages());
                    }}
                >
                    <FontAwesomeIcon
                        icon={faUserGroup}
                        size="xl"
                    ></FontAwesomeIcon>

                    {peerInfoStatus && (
                        <div className="info-dot">
                            {peerInfoStatus === "error" && (
                                <ExclamationTriangleIcon
                                    color="red"
                                    width="15"
                                    height="15"
                                />
                            )}
                            {peerInfoStatus === "warning" && (
                                <ExclamationTriangleIcon
                                    color="orange"
                                    width="15"
                                    height="15"
                                />
                            )}
                            {peerInfoStatus === "info" && (
                                <InfoCircledIcon
                                    color="grey"
                                    width="15"
                                    height="15"
                                />
                            )}
                        </div>
                    )}
                </button>
            </div>

            <div className="info-logo">
                <button
                    title="system messages"
                    id="info-button"
                    onClick={() => {
                        dispatch(toastActions.toggleToasts());
                    }}
                >
                    {online ? (
                        <CheckCircledIcon
                            color="green"
                            width="25"
                            height="25"
                        />
                    ) : (
                        <ValueIcon color="grey" width="25" height="25" />
                    )}
                    {infoStatus && (
                        <div className="info-dot">
                            {infoStatus === "error" && (
                                <ExclamationTriangleIcon
                                    color="red"
                                    width="15"
                                    height="15"
                                />
                            )}
                            {infoStatus === "warning" && (
                                <ExclamationTriangleIcon
                                    color="orange"
                                    width="15"
                                    height="15"
                                />
                            )}
                            {infoStatus === "info" && (
                                <InfoCircledIcon
                                    color="grey"
                                    width="15"
                                    height="15"
                                />
                            )}
                        </div>
                    )}
                </button>
            </div>
            <div className="user-logo">
                <button
                    title="user details"
                    onClick={() => setShowMenu((showMenu) => !showMenu)}
                >
                    <PersonIcon width="25" height="25" />
                </button>
                {showMenu && <UserMenu show={showMenu} />}
            </div>
        </div>
    );
};
export default User;
