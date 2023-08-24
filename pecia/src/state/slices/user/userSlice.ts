import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type NetworkState = 'open' | 'disconnected' | 'closed';

type UserState = {
    username: string;
    passcode: string;
    online: boolean;
    peerID: string;
    networkState: NetworkState;
};

const setUsername = (state: UserState, action: PayloadAction<string>) => {
    state.username = action.payload;
};

const setPasscode = (state: UserState, action: PayloadAction<string>) => {
    state.passcode = action.payload;
};

const setPeerID = (state: UserState, action: PayloadAction<string>) => {
    state.peerID = action.payload;
};

const setNetworkState = (
    state: UserState,
    action: PayloadAction<NetworkState>
) => {
    state.networkState = action.payload;
};

const toggleOnline = (state: UserState) => {
    state.online = !state.online;
};

const retrievedName = localStorage.getItem('pecia-username');
const retrievedPasscode = localStorage.getItem('pecia-passcode');
const initialState: UserState = {
    username: retrievedName || '',
    passcode: retrievedPasscode || '',
    online: false,
    peerID: '',
    networkState: 'closed',
};

const usernameSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsername,
        setPasscode,
        setPeerID,
        setNetworkState,
        toggleOnline,
    },
});

export default usernameSlice;
