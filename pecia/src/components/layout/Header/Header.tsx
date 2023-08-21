import { Link } from 'react-router-dom';
import User from '../../widgets/User';

import './Header.css';

const Header = () => {
    return (
        <header>
            <Link to="/">
                <h3>Pecia</h3>
            </Link>

            <User />
        </header>
    );
};

export default Header;
