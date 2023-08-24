import { Dispatch } from '@reduxjs/toolkit';
import Peer from 'peerjs';
import { useEffect, useRef } from 'react';

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
        } else {
            try {
                const peer = new Peer();
                console.log(peer);
                peer.on('open', (id) => {
                    dispatch(userActions.setPeerID(id));
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
                            `error in the peer network: ${err.type}`,
                            'error'
                        )
                    );
                });
                peer.on('close', () => {
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
};

export default usePeer;
