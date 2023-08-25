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
    const { username, passcode, online } = useSelector(selector);
    const dispatch = useDispatch();
    const query = useQuery();
    const doc = query.get('doc');
    const user = query.get('user');
    const join = () => {
        if (peer.current && connections.current) {
            dispatch(
                connect(
                    peer.current,
                    user,
                    username,
                    passcode,
                    doc,
                    dispatch,
                    connections.current
                )
            );
        }
    };
    const errors =
        !doc ||
        !user ||
        !username ||
        !passcode ||
        !peer.current ||
        !connections.current ||
        !online;
    return (
        <main>
            {errors && (
                <div className="errors-wrapper">
                    {' '}
                    {!doc && (
                        <p>
                            oh dear, no document is specified, so there's
                            nothing to join!
                        </p>
                    )}
                    {!user && (
                        <p>
                            oh dear, no user is specified, we can't join a
                            session!
                        </p>
                    )}
                    {!peer.current && (
                        <p>
                            oh dear, connection not available, are you working
                            offline?
                        </p>
                    )}
                </div>
            )}
            {!errors && (
                <div className="info-wrapper">
                    <p>Attempting to connect to {user}</p>
                    <p>You will be identified as username {username}</p>
                    <p>With the passcode {passcode}</p>

                    <button onClick={join}>Join</button>
                </div>
            )}
        </main>
    );
};

export default JoinPage;
