import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
    name: 'theme',
    initialState: 'dark',
    reducers: {
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state = action.payload;
        },
    },
});

export default themeSlice;
