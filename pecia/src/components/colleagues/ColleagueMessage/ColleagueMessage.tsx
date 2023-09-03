const ColleagueMessage = ({ message, children }) => {
    console.log(message);
    return <div className="colleague-message">{...children}</div>;
};

export default ColleagueMessage;
