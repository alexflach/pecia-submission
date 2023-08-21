import { Link } from 'react-router-dom';

import './NotFoundPage.css';

const NotFoundPage = () => {
    return (
        <div className="not-found">
            <h2 className="not-found-head">
                Sorry, we couldn't find that page
            </h2>
            <Link to="/">
                <h4>Return Home</h4>
            </Link>
        </div>
    );
};

export default NotFoundPage;
