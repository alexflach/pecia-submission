import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../state/store';
import { actions } from '../../../state/slices/toast';
import {
    PersonIcon,
    CheckCircledIcon,
    ExclamationTriangleIcon,
    ValueIcon,
} from '@radix-ui/react-icons';

import UserMenu from './UserMenu';
import './User.css';

const onlineSelector = (state: RootState) => state.user.online;
const User = () => {
    const online = useSelector(onlineSelector);
    const dispatch = useDispatch();

    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="user-panel">
            <div className="info-logo">
                <button
                    onClick={() => {
                        dispatch(actions.toggleToasts());
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
                </button>
            </div>
            <div className="user-logo">
                <button onClick={() => setShowMenu((showMenu) => !showMenu)}>
                    <PersonIcon width="25" height="25" />
                </button>
                {showMenu && <UserMenu show={showMenu} />}
            </div>
        </div>
    );
};
export default User;
