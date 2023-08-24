import { useState } from 'react';
import { PersonIcon } from '@radix-ui/react-icons';

import UserMenu from './UserMenu';
import './User.css';
const User = () => {
    const [showMenu, setShowMenu] = useState(false);
    return (
        <div className="user-logo">
            <button onClick={() => setShowMenu((showMenu) => !showMenu)}>
                <PersonIcon width="25" height="25" />
            </button>
            {showMenu && <UserMenu show={showMenu} />}
        </div>
    );
};
export default User;
