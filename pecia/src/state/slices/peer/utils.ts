import { Dispatch } from '@reduxjs/toolkit';
import Peer, { DataConnection } from 'peerjs';
import { actions as userActions } from '../user';
import { actions as toastActions } from '../toast';
import { actions as peerActions } from '../peer';
import { DataPacket } from './peerReducers';

export const bootstrapConnection = (
    connection: DataConnection,
    dispatch: Dispatch
) => {
    connection.on('data', (data: DataPacket) => {
        console.log(data);
        dispatch(peerActions.dataReceived(data));
    });
    connection.on('error', (error) => {
        dispatch(
            peerActions.connectionErrorReported({
                //@ts-expect-error peer errors have a type property
                type: error.type,
                message: error.message,
            })
        );
        console.error(error.message);
    });
    connection.on('close', () => {
        dispatch(peerActions.removeConnection(connection.peer));
    });
    connection.on('open', () => {
        dispatch(
            peerActions.addConnection(connection.peer, connection.metadata.doc)
        );
    });
    connection.on('iceStateChanged', () => console.log('iceStateChanged ?'));
};

export const bootstrapPeer = (
    peer: Peer,
    dispatch: Dispatch,
    connectionsRef: React.MutableRefObject<DataConnection[]>
) => {
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
    // Someone is trying to connection
    peer.on('connection', (dataConnection: DataConnection) => {
        connectionsRef.current.push(dataConnection);
        bootstrapConnection(dataConnection, dispatch);
        const { username, passcode, doc } = dataConnection.metadata;
        dispatch(
            peerActions.connectionRequested(
                dataConnection.peer,
                passcode,
                username,
                doc
            )
        );
        dispatch(
            toastActions.addToast(
                `connection from ${dataConnection.metadata.username} 
                            with passcode ${dataConnection.metadata.passcode}
                            for document ${dataConnection.metadata.doc}`,
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
            peerActions.peerErrorReported({
                //@ts-expect-error peer errors have a type
                type: err.type,
                message: err.message,
            })
        );
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
};