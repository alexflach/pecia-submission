import { Dispatch } from '@reduxjs/toolkit';
import Peer from 'peerjs';
import { useEffect, useRef } from 'react';

import { actions as userActions } from '../state/slices/user';
import { actions as toastActions } from '../state/slices/toast';

const usePeer = (online: boolean, dispatch: Dispatch) => {
    const peerRef = useRef<Peer>();

    useEffect(() => {
        if (!online) {
            peerRef.current = null;
            dispatch(userActions.setPeerID(''));
        } else {
            try {
                const peer = new Peer();
                peer.on('open', (id) => {
                    dispatch(userActions.setPeerID(id));
                });
                peerRef.current = peer;
                dispatch(toastActions.addToast('conected!', 'info'));
            } catch (error) {
                console.error(error);
            }
        }
    }, [online, dispatch]);
};

export default usePeer;
