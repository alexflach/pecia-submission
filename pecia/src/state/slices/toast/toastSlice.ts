import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type ToastType = 'warning' | 'info' | 'error';
type Toast = {
    id: string;
    message: string;
    type: ToastType;
};

type ToastState = {
    toasts: Toast[];
};

const addToast = {
    reducer: (state: ToastState, action: PayloadAction<Toast>) => {
        state.toasts.push(action.payload);
    },
    prepare: (message: string, type: ToastType) => {
        return {
            payload: {
                message,
                type,
                id: crypto.randomUUID(),
            },
        };
    },
};

const removeToast = (state: ToastState, action: PayloadAction<string>) => {
    state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
};

const initialState: ToastState = {
    toasts: [],
};

const toastSlice = createSlice({
    name: 'toasts',
    initialState,
    reducers: {
        addToast,
        removeToast,
    },
});

export default toastSlice;
