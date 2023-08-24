import { useState } from 'react';
import { PersonIcon } from '@radix-ui/react-icons';

import UserMenu from './UserMenu';
import './User.css';
const User = () => {
    const [showMenu, setShowMenu] = useState(false);
    return (
        <div className="user-logo">
            <PersonIcon
                onClick={() => setShowMenu(!showMenu)}
                width="25"
                height="25"
            />
            {showMenu && <UserMenu />}
        </div>
    );
};
export default User;
