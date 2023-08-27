import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type NetworkState = 'open' | 'disconnected' | 'closed';

type UserState = {
    username: string;
    passcode: string;
    online: boolean;
    peerID: string;
    peciaID: string;
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
let retrievedPeciaID = localStorage.getItem('pecia-user-id');

if (!retrievedPeciaID) {
    retrievedPeciaID = crypto.randomUUID();
    try {
        localStorage.setItem('pecia-user-id', retrievedPeciaID);
    } catch (error) {
        console.error(error);
    }
}

const initialState: UserState = {
    username: retrievedName || '',
    passcode: retrievedPasscode || '',
    online: true,
    peerID: '',
    networkState: 'closed',
    peciaID: retrievedPeciaID,
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
