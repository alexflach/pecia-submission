import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import DocCard from '../DocCard';
import { RootState } from '../../../state/store';

import './YourDocs.css';

const docsSelector = (state: RootState) => state.docs.docs;

const YourDocs = () => {
    const docs = useSelector(docsSelector);
    const navigate = useNavigate();

    return (
        <>
            <h3 className="docs-title">Your Documents</h3>{' '}
            <div className="your-docs-banner">
                {docs &&
                    docs.map((doc) => (
                        <DocCard
                            key={doc.id}
                            title={doc.title}
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
