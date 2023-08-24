import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type UserState = { username: string; passcode: string; online: boolean };

const setUsername = (state: UserState, action: PayloadAction<string>) => {
    state.username = action.payload;
};

const setPasscode = (state: UserState, action: PayloadAction<string>) => {
    state.passcode = action.payload;
};

const toggleOnline = (state: UserState) => {
    state.online = !state.online;
};

const retrievedName = localStorage.getItem('pecia-username');
const retrievedPasscode = localStorage.getItem('pecia-passcode');

const usernameSlice = createSlice({
    name: 'user',
    initialState: {
        username: retrievedName || '',
        passcode: retrievedPasscode || '',
        online: false,
    },
    reducers: {
        setUsername,
        setPasscode,
        toggleOnline,
    },
});

export default usernameSlice;
