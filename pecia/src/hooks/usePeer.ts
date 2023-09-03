import { Dispatch } from '@reduxjs/toolkit';
import Peer, { DataConnection } from 'peerjs';
import { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

import { actions as userActions } from '../state/slices/user';
import { actions as toastActions } from '../state/slices/toast';
import { bootstrapPeer } from '../state/slices/peer/utils';

const usePeer = (online: boolean, dispatch: Dispatch) => {
    const peerRef = useRef<Peer>();
    const connectionsRef = useRef<DataConnection[]>([]);

    useEffect(() => {
        if (!online) {
            if (connectionsRef.current) {
                connectionsRef.current.forEach((connection) => {
                    connection.close();
                });
                connectionsRef.current = [];
            }
            if (peerRef.current) {
                peerRef.current.destroy();
                peerRef.current = null;
            }
            dispatch(userActions.setPeerID(''));
            dispatch(userActions.setNetworkState('closed'));
        } else {
            if (peerRef.current && !peerRef.current.disconnected) return;
            try {
                const peer = new Peer();
                bootstrapPeer(peer, dispatch, connectionsRef);
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
            if (connectionsRef.current.length) {
                connectionsRef.current.forEach((connection) => {
                    connection.close();
                })
            }
        };
    }, [online, dispatch]);
    return {
        peer: peerRef,
        connections: connectionsRef,
    };
};
type ContextType = {
    peer: React.MutableRefObject<Peer>;
    connections: React.MutableRefObject<DataConnection[]>;
};

export const usePeerContext = () => {
    return useOutletContext<ContextType>();
};

export default usePeer;
