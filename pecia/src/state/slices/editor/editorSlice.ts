import { createSlice } from '@reduxjs/toolkit';

type EditorState = {
    boldActive: boolean;
    italicActive: boolean;
    strikethroughActive: boolean;
};

const toggleBold = (state: EditorState) => {
    console.log('toggling bold');
    state.boldActive = !state.boldActive;
};

const toggleItalic = (state: EditorState) => {
    state.italicActive = !state.italicActive;
};

const toggleStrikethrough = (state: EditorState) => {
    state.strikethroughActive = !state.strikethroughActive;
};

const editorSlice = createSlice({
    name: 'user',
    initialState: {
        boldActive: false,
        italicActive: false,
        strikethroughActive: false,
    },
    reducers: {
        toggleBold,
        toggleItalic,
        toggleStrikethrough,
    },
});

export default editorSlice;
