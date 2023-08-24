import { Dispatch } from '@reduxjs/toolkit';
import Peer from 'peerjs';
import { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

import { actions as userActions } from '../state/slices/user';
import { actions as toastActions } from '../state/slices/toast';

const usePeer = (online: boolean, dispatch: Dispatch) => {
    const peerRef = useRef<Peer>();

    useEffect(() => {
        if (!online) {
            if (peerRef.current) {
                peerRef.current.destroy();
                peerRef.current = null;
            }
            dispatch(userActions.setPeerID(''));
            dispatch(userActions.setNetworkState('closed'));
        } else {
            try {
                const peer = new Peer();
                console.log(peer);
                peer.on('open', (id) => {
                    dispatch(userActions.setPeerID(id));
                    dispatch(userActions.setNetworkState('open'));
                    dispatch(
                        toastActions.addToast(
                            'connected! You can now share documents',
                            'info'
                        )
                    );
                });
                peer.on('connection', (dataConnection) => {
                    dispatch(
                        toastActions.addToast(
                            `connection established with ${dataConnection.peer}`,
                            'info'
                        )
                    );
                });
                peer.on('disconnected', () => {
                    if (peer.destroyed) return;
                    dispatch(userActions.setNetworkState('disconnected'));
                    // dispatch(
                    //     toastActions.addToast(
                    //         'disconnected from the peer network, trying to reconnect, you may have to reset your connection',
                    //         'warning'
                    //     )
                    // );
                    peer.reconnect();
                });
                peer.on('error', (err) => {
                    dispatch(
                        toastActions.addToast(
                            //@ts-expect-error Peer errors contain a type;
                            `error in the peer network: ${err.type}
                            
                            ${err.message}`,
                            'error'
                        )
                    );
                });
                peer.on('close', () => {
                    dispatch(userActions.setNetworkState('closed'));
                    dispatch(
                        toastActions.addToast(
                            `connection to peer network closed`,
                            'warning'
                        )
                    );
                });
                peerRef.current = peer;
            } catch (error) {
                console.error(error);
                dispatch(
                    toastActions.addToast(
                        `connection failed: ${error.message}`,
                        'error'
                    )
                );
            }
        }
        return () => {
            if (peerRef.current?.destroy) {
                peerRef.current.destroy();
            }
        };
    }, [online, dispatch]);
    return peerRef;
};
type ContextType = {
    peer: React.MutableRefObject<Peer>;
};

export const usePeerContext = () => {
    return useOutletContext<ContextType>();
};

export default usePeer;
