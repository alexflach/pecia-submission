import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type UserNameState = { username: string; passcode: string };

const setUsername = (state: UserNameState, action: PayloadAction<string>) => {
    state.username = action.payload;
};

const setPasscode = (state: UserNameState, action: PayloadAction<string>) => {
    state.passcode = action.payload;
};

const retrievedName = localStorage.getItem('pecia-username');
const retrievedPasscode = localStorage.getItem('pecia-passcode');

const usernameSlice = createSlice({
    name: 'user',
    initialState: {
        username: retrievedName || '',
        passcode: retrievedPasscode || '',
    },
    reducers: {
        setUsername,
        setPasscode,
    },
});

export default usernameSlice;
