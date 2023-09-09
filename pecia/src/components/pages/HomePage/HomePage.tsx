// import { Link } from 'react-router-dom';
//import './HomePage.css';

import { useDispatch } from "react-redux";
import YourDocsBanner from "../../widgets/YourDocsBanner";
import { actions } from "../../../state/slices/editor";
import { useEffect } from "react";

const HomePage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.setCurrentDocID(""));
    }, [dispatch]);
    return (
        <div id="homepage">
            <YourDocsBanner />
        </div>
    );
};

export default HomePage;
