import { useDispatch } from 'react-redux';
import { actions } from '../../../state/slices/user';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
const { setUsername, setPasscode } = actions;

import './UserMenu.css';

const UserMenu = () => {
    const selector = (state: RootState) => state.user;
    const { username, passcode } = useSelector(selector);
    const dispatch = useDispatch();
    const handleUNChange = (e) => {
        dispatch(setUsername(e.target.value));
        localStorage.setItem('pecia-username', e.target.value);
    };
    const handlePCChange = (e) => {
        dispatch(setPasscode(e.target.value));
        localStorage.setItem('pecia-passcode', e.target.value);
    };
    return (
        <div className="user-menu">
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
        </div>
    );
};

export default UserMenu;
