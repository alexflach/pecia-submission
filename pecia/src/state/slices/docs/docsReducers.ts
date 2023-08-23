import { PayloadAction } from '@reduxjs/toolkit';

export type Doc = { id: string; title: string };

export type DocsState = { docs: Doc[] };

export const addDoc = {
    reducer: (state: DocsState, action: PayloadAction<Doc>) => {
        state.docs.push(action.payload);
    },
    prepare: (id: string, title: string = '') => {
        return {
            payload: {
                id,
                title,
            },
        };
    },
};

export const setTitle = {
    reducer: (state: DocsState, action: PayloadAction<Doc>) => {
        state.docs = state.docs.map((doc) => {
            if (doc.id !== action.payload.id) return doc;
            return action.payload;
        });
    },
    prepare: (id: string, title: string) => {
        return {
            payload: {
                id,
                title,
            },
        };
    },
};

export const deleteDoc = (state: DocsState, action: PayloadAction<string>) => {
    state.docs = state.docs.filter((doc) => doc.id !== action.payload);
};
