import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { actions } from '../../../state/slices/docs';

import DocCard from '../DocCard';

import './NewDocs.css';

const NewDocsBanner = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const newDocHandler = () => {
        const id = crypto.randomUUID();
        dispatch(actions.addDoc(id));
        navigate(`/edit?doc=${id}`);
    };
    return (
        <>
            <h3 className="docs-title">Create a document</h3>
            <div className="new-docs-banner">
                <DocCard onClick={newDocHandler} title="from scratch" />
                <DocCard onClick={newDocHandler} title="from blank" />
            </div>
        </>
    );
};

export default NewDocsBanner;
