import { useDispatch } from 'react-redux';
import { actions } from '../../../state/slices/user';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import * as Switch from '@radix-ui/react-switch';

const { setUsername, setPasscode, toggleOnline } = actions;

import './UserMenu.css';
type UserMenuPropTypes = {
    show: boolean;
};

const UserMenu = ({ show }: UserMenuPropTypes) => {
    const selector = (state: RootState) => state.user;
    const { username, passcode, online } = useSelector(selector);
    const dispatch = useDispatch();
    const handleUNChange = (e) => {
        dispatch(setUsername(e.target.value));
    };
    const handlePCChange = (e) => {
        dispatch(setPasscode(e.target.value));
    };
    return (
        <div className={`user-menu ${show ? 'show' : ''}`}>
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
