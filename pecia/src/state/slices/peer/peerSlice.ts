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
    deleteColleague,
    updateColleagueDocs
} from './peerReducers';

let initialColleagues = [];

try {
    const retrievedColleagues = localStorage.getItem('pecia-colleagues')
    if (retrievedColleagues) {
        const parsedColleagues = JSON.parse(retrievedColleagues);
        initialColleagues = parsedColleagues.map(colleague => ({...colleague, connectionStatus: 'DISCONNECTED', peerID: ''}))
    }
} catch (error) {
    console.error(error);
}

const initialState: PeerState = {
    connections: [],
    requestedConnections: [],
    peerErrors: [],
    connectionErrors: [],
    messages: [],
    colleagues: initialColleagues,
};
const peerSlice = createSlice({
    name: 'peer',
    initialState,
    reducers: {
        addConnection,
        addColleague,
        updateColleague,
        updateColleagueDocs,
        deleteColleague,
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
