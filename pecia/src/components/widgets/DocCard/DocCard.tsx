import './DocCard.css';

const DocCard = ({ onClick }) => {
    return (
        <div onClick={onClick} className="doc-card">
            <p>new doc card</p>
        </div>
    );
};

export default DocCard;
