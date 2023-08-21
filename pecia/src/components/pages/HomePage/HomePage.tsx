// import { Link } from 'react-router-dom';
//import './HomePage.css';

import NewDocsBanner from '../../widgets/NewDocsBanner';
import YourDocsBanner from '../../widgets/YourDocsBanner';

const HomePage = () => {
    return (
        <div id="homepage">
            <NewDocsBanner />
            <YourDocsBanner />
        </div>
    );
};

export default HomePage;
