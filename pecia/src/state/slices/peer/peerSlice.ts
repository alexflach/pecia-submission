import { createSlice } from '@reduxjs/toolkit';
import {
    PeerState,
    addConnection,
    removeConnection,
    updateConnectionPasscode,
    updateConnectionStatus,
    updateConnectionUsername,
    connect,
    connectionRequested,
    connectionErrorReported,
    peerErrorReported,
    dataReceived,
} from './peerReducers';

const initialState: PeerState = {
    connections: [],
    requestedConnections: [],
    peerErrors: [],
    connectionErrors: [],
    messages: [],
};
const peerSlice = createSlice({
    name: 'peer',
    initialState,
    reducers: {
        addConnection,
        removeConnection,
        updateConnectionPasscode,
        updateConnectionStatus,
        updateConnectionUsername,
        connect,
        connectionRequested,
        connectionErrorReported,
        peerErrorReported,
        dataReceived,
    },
});

export default peerSlice;
