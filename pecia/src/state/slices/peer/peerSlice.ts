import { createSlice } from '@reduxjs/toolkit';
import {
    PeerState,
    addConnection,
    removeConnection,
    updateConnectionPasscode,
    updateConnectionStatus,
    updateConnectionUsername,
} from './peerReducers';

const initialState: PeerState = {
    connections: [],
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
    },
});

export default peerSlice;
