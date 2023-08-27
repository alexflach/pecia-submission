import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type ToastType = 'warning' | 'info' | 'error';
type Toast = {
    id: string;
    message: string;
    type: ToastType;
};

type ToastState = {
    toasts: Toast[];
    showToasts: boolean;
    showWarning: boolean;
    showError: boolean;
};

const addToast = {
    reducer: (state: ToastState, action: PayloadAction<Toast>) => {
        state.toasts.push(action.payload);
        switch (action.payload.type) {
            case 'warning':
                state.showWarning = true;
                break;
            case 'error':
                state.showError = true;
                break;
            default:
                break;
        }
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
    const newToasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
    );
    state.toasts = newToasts;
    if (!newToasts.length) state.showToasts = false;
    if (!newToasts.find((toast) => toast.type === 'warning')) {
        state.showWarning = false;
    }
    if (!newToasts.find((toast) => toast.type === 'warning')) {
        state.showError = false;
    }
};

const clearToasts = (state: ToastState) => {
    state.toasts = [];
    state.showWarning = false;
    state.showError = false;
    state.showToasts = false;
};
const toggleToasts = (state: ToastState) => {
    state.showToasts = !state.showToasts;
};

const showToasts = (state: ToastState) => {
    state.showToasts = true;
};

const hideToasts = (state: ToastState) => {
    state.showToasts = false;
};

const showWarning = (state: ToastState) => {
    state.showWarning = true;
};

const showError = (state: ToastState) => {
    state.showError = true;
};

const initialState: ToastState = {
    toasts: [],
    showToasts: false,
    showWarning: false,
    showError: false,
};

const toastSlice = createSlice({
    name: 'toasts',
    initialState,
    reducers: {
        addToast,
        removeToast,
        toggleToasts,
        showError,
        showWarning,
        showToasts,
        hideToasts,
        clearToasts,
    },
});

export default toastSlice;
