import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { reducer as userReducer } from './slices/user';
import { reducer as themeReducer } from './slices/theme';
import { reducer as editorReducer } from './slices/editor';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
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

export default store;
