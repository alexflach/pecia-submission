import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { reducer as docsReducer } from './slices/docs';
import { reducer as userReducer } from './slices/user';
import { reducer as themeReducer } from './slices/theme';
import { reducer as editorReducer } from './slices/editor';
import { reducer as toastReducer } from './slices/toast';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        docs: docsReducer,
        user: userReducer,
        theme: themeReducer,
        editor: editorReducer,
        toast: toastReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({ serializableCheck: false }).concat(
            sagaMiddleware
        );
    },
});

//sagaMiddleware.run(TODO: Add middleware here);

export type RootState = ReturnType<typeof store.getState>;

const persist = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error(error);
    }
};

let previousDocs: string;
const persistDocs = () => {
    const docsSelector = (state: RootState) => state.docs.docs;
    const docs = docsSelector(store.getState());
    const docString = JSON.stringify(docs);
    if (docString !== previousDocs) {
        previousDocs = docString;
        persist('pecia-docs', docString);
    }
};

let oldUN: string, oldPC: string;
const persistUser = () => {
    const userSelector = (state: RootState) => state.user;
    const { username, passcode } = userSelector(store.getState());
    if (username !== oldUN) {
        oldUN = username;
        persist('pecia-username', username);
    }
    if (passcode !== oldPC) {
        oldPC = passcode;
        persist('pecia-passcode', passcode);
    }
};

store.subscribe(persistDocs);
store.subscribe(persistUser);

export default store;
