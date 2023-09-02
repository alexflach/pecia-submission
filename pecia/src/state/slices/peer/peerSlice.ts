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
    addColleague,
    updateColleague,
} from './peerReducers';

const initialState: PeerState = {
    connections: [],
    requestedConnections: [],
    peerErrors: [],
    connectionErrors: [],
    messages: [],
    colleagues: [],
};
const peerSlice = createSlice({
    name: 'peer',
    initialState,
    reducers: {
        addConnection,
        addColleague,
        updateColleague,
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
