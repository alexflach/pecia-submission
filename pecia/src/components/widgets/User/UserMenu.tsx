import { useDispatch } from "react-redux";
import { actions } from "../../../state/slices/user";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import * as Switch from "@radix-ui/react-switch";
import CopyButton from "../CopyButton";

const { setUsername, setPasscode, toggleOnline } = actions;

import "./UserMenu.css";
type UserMenuPropTypes = {
    show: boolean;
};

const UserMenu = ({ show }: UserMenuPropTypes) => {
    const selector = (state: RootState) => state.user;
    const { username, passcode, online, peciaID, peerID } =
        useSelector(selector);
    const dispatch = useDispatch();
    const handleUNChange = (e) => {
        dispatch(setUsername(e.target.value));
    };
    const handlePCChange = (e) => {
        dispatch(setPasscode(e.target.value));
    };
    return (
        <div className={`user-menu ${show ? "show" : ""}`}>
            <p>Set Your Details</p>
            <label htmlFor="username">Username</label>
            <input
                name="username"
                value={username}
                onChange={handleUNChange}
            ></input>
            <label htmlFor="passcode">Passcode</label>
            <input
                name="username"
                value={passcode}
                onChange={handlePCChange}
            ></input>
            <div className="pecia-id-wrapper">
                <p>Your Pecia ID:</p>
                <div className="pecia-id-text">
                    <p className="pecia-id">{peciaID}</p>
                    <CopyButton textToCopy={peciaID} />
                </div>
            </div>
            <div className="peer-id-wrapper">
                <p>Your Connection ID:</p>
                <div className="peer-id-text">
                    {online ? (
                        <div className="peer-id-text">
                            <p className="peer-id">{peerID}</p>
                            <CopyButton textToCopy={peerID} />
                        </div>
                    ) : (
                        <p className="peer-id">Not online</p>
                    )}
                </div>
            </div>

            <label htmlFor="work-online">Work Online?</label>
            <Switch.Root
                className="switch-root"
                id="work-online"
                checked={online}
                onCheckedChange={() => {
                    dispatch(toggleOnline());
                }}
            >
                <Switch.Thumb className="switch-thumb" />
            </Switch.Root>
        </div>
    );
};

export default UserMenu;
