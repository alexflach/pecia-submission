import useQuery from '../../../hooks/useQuery';

import './JoinPage.css';
const JoinPage = () => {
    const query = useQuery();
    const doc = query.get('doc');
    const user = query.get('user');
    return (
        <main>
            {!doc && (
                <p>
                    oh dear, no document is specified, so there's nothing to
                    join!
                </p>
            )}
            {!user && (
                <p> oh dear, no user is specified, we can't join a session!</p>
            )}
            {doc && user && <p>Attempting to connect to {user}</p>}
        </main>
    );
};

export default JoinPage;
