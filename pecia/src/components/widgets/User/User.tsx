import { PersonIcon } from '@radix-ui/react-icons';
import './User.css';
import { useState } from 'react';

import UserMenu from './UserMenu';

const User = () => {
    const [showMenu, setShowMenu] = useState(false);
    return (
        <div className="user-logo" onClick={() => setShowMenu(!showMenu)}>
            <PersonIcon width="25" height="25" />
            {showMenu && <UserMenu />}
        </div>
    );
};
export default User;
