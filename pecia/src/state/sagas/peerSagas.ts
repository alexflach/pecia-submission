import { takeEvery, apply, call, put } from 'redux-saga/effects';
import { bootstrapConnection } from '../slices/peer/utils';

function* connectToPeer(action) {
    const { peer, id, username, passcode, doc, connections, dispatch } =
        action.payload;
    console.log(action.payload);
    try {
        console.log('trying to connect...');
        const connection = yield apply(peer, peer.connect, [
            id,
            { metadata: { username, passcode, doc } },
        ]);
        yield call(bootstrapConnection, connection, dispatch);
        yield call(connections.current.push, connection);
    } catch (error) {
        console.error(error);
    }
}

function* restoreVersion(action) {
    yield put({ type: 'editor/restoreVersionByID', payload: action.payload });
    yield put({ type: 'editor/initEditor', payload: { owner: '', title: '' } });
}
export default function* rootSaga() {
    yield takeEvery('peer/connect', connectToPeer);
    yield takeEvery('editor/restoreVersionPrep', restoreVersion);
}
