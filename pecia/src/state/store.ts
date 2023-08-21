import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { reducer as docsReducer } from './slices/docs';
import { reducer as userReducer } from './slices/user';
import { reducer as themeReducer } from './slices/theme';
import { reducer as editorReducer } from './slices/editor';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        docs: docsReducer,
        user: userReducer,
        theme: themeReducer,
        editor: editorReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({ serializableCheck: false }).concat(
            sagaMiddleware
        );
    },
});

//sagaMiddleware.run(TODO: Add middleware here);

export type RootState = ReturnType<typeof store.getState>;

let previousDocs;
const persistDocs = () => {
    const docsSelector = (state: RootState) => state.docs.docs;
    const docs = docsSelector(store.getState());
    const docString = JSON.stringify(docs);
    if (docString !== previousDocs) {
        previousDocs = docString;
        localStorage.setItem(`pecia-docs`, docString);
    }
};

store.subscribe(persistDocs);

export default store;
