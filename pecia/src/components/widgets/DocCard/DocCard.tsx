import './DocCard.css';

const DocCard = ({ onClick, title = '' }) => {
    return (
        <div onClick={onClick} className="doc-card">
            <p>{title || 'Untitled...'}</p>
        </div>
    );
};

export default DocCard;
