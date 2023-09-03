import { PayloadAction } from "@reduxjs/toolkit";

export type Doc = { id: string; title: string; versions: string[] };

export type DocsState = { docs: Doc[] };

export const addDoc = {
    reducer: (state: DocsState, action: PayloadAction<Doc>) => {
        state.docs.push(action.payload);
    },
    prepare: (id: string, title: string = "") => {
        return {
            payload: {
                id,
                title,
                versions: [],
            },
        };
    },
};

export const setTitle = {
    reducer: (
        state: DocsState,
        action: PayloadAction<{ id: string; title: string }>,
    ) => {
        state.docs = state.docs.map((doc) => {
            if (doc.id !== action.payload.id) return doc;
            return {
                ...doc,
                title: action.payload.title,
            };
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
