import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type UserNameState = { username: string };

const setUsername = {
    reducer: (state: UserNameState, action: PayloadAction<string>) => {
        state.username = action.payload;
    },
    prepare: (username: string) => {
        return {
            payload: username,
        };
    },
};

const usernameSlice = createSlice({
    name: 'user',
    initialState: {
        username: '',
    },
    reducers: {
        setUsername,
    },
});

export default usernameSlice;
