import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

export default configureStore({
    reducer: {},
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({ serializableCheck: false }).concat(
            sagaMiddleware
        );
    },
});

//sagaMiddleware.run(TODO: Add middleware here);
