import useQuery from '../../../hooks/useQuery';
import { useDispatch, useSelector } from 'react-redux';
import { usePeerContext } from '../../../hooks/usePeer';

import './JoinPage.css';
import { RootState } from '../../../state/store';
import { actions } from '../../../state/slices/peer';

const { connect } = actions;

const selector = (state: RootState) => state.user;

const JoinPage = () => {
    const { peer, connections } = usePeerContext();
    const { username, passcode } = useSelector(selector);
    const dispatch = useDispatch();
    const query = useQuery();
    const doc = query.get('doc');
    const user = query.get('user');
    console.log(peer, connections);

    if (peer.current && username && passcode && doc && user) {
        dispatch(
            connect(peer.current, user, username, passcode, doc, dispatch)
        );
    }
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
