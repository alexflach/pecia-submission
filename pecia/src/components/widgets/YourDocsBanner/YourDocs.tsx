import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import DocCard from '../DocCard';
import './YourDocs.css';
import { RootState } from '../../../state/store';

const docsSelector = (state: RootState) => state.docs.docs;

const YourDocs = () => {
    const docs = useSelector(docsSelector);
    const navigate = useNavigate();

    return (
        <>
            <h3>Your Documents</h3>{' '}
            <div className="your-docs-banner">
                {docs &&
                    docs.map((doc) => (
                        <DocCard
                            key={doc.id}
                            onClick={() => {
                                navigate(`/edit?doc=${doc.id}`);
                            }}
                        />
                    ))}
            </div>
        </>
    );
};

export default YourDocs;
