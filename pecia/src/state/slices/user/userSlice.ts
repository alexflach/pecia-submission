import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type UserState = {
    username: string;
    passcode: string;
    online: boolean;
    peerID: string;
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
};

const usernameSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsername,
        setPasscode,
        setPeerID,
        toggleOnline,
    },
});

export default usernameSlice;
