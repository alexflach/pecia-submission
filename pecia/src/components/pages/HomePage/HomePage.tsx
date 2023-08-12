import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    return (
        <div id="homepage">
            <h1>Welcome to Pecia</h1>
            <p>
                Checkout your <Link to="docs">docs</Link>
            </p>
        </div>
    );
};

export default HomePage;
