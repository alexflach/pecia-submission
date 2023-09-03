import { select, takeEvery, apply, call, put } from "redux-saga/effects";
import {
    ConnectToPeerPayload,
    ConnectionRequestedPayload,
    Colleague,
} from "../slices/peer/peerReducers.ts";
import { bootstrapConnection, ConnectionMetadata } from "../slices/peer/utils";
import { RootState } from "../store.ts";
import { actions } from "../slices/peer";

function* connectToPeer(action: {
    type: string;
    payload: ConnectToPeerPayload;
}) {
    const {
        peerID,
        toPeciaID,
        toUsername,
        toPasscode,
        fromUsername,
        fromPasscode,
        fromPeciaID,
        connections,
        dispatch,
        peer,
    } = action.payload;
    try {
        const metadata: ConnectionMetadata = {
            toPasscode,
            toPeciaID,
            toUsername,
            fromPasscode,
            fromPeciaID,
            fromUsername,
        };
        const connection = yield apply(peer, peer.connect, [
            peerID,
            {
                metadata,
            },
        ]);
        yield call(bootstrapConnection, connection, dispatch);
        yield apply(connections, connections.push, [connection]);
    } catch (error) {
        console.error(error);
    }
}

function* connectionRequested(action: {
    type: string;
    payload: ConnectionRequestedPayload;
}) {
    const state: RootState = yield select();
    const colleagues = state.peer.colleagues;
    const colleagueRequests = state.peer.colleagueRequests;
    const metadata = action.payload.connection.metadata;
    const { fromPeciaID, fromPasscode, fromUsername } = metadata;

    const knownColleague = colleagues.find(
        (colleague) => colleague.peciaID === fromPeciaID,
    );
    const alreadyPendingColleague = colleagueRequests.find(
        (colleague) => colleague.peciaID === fromPeciaID,
    );
    //check if the connection request is a duplicate
    if (alreadyPendingColleague) return;
    //otherwise check if we know the colleague
    else if (!knownColleague) {
        //if not we dispatch a colleague request
        const newColleague: Colleague = {
            peciaID: fromPeciaID,
            username: fromUsername,
            passcode: fromPasscode,
            docs: [],
            peerID: action.payload.connection.peer,
            status: "PENDING",
            connectionStatus: "CONNECTED",
        };
        const colleagueRequest = yield apply(
            actions,
            actions.newColleagueRequest,
            [newColleague],
        );
        yield put(colleagueRequest);
        //check if details are mismatched
    } else if (
        !knownColleague.username === fromUsername ||
        !knownColleague.passcode === fromPasscode
    ) {
        const colleagueDetailsChanged = yield apply(
            actions,
            actions.colleagueDetailsChanged,
            [fromPeciaID, fromUsername, fromPasscode],
        );
        yield put(colleagueDetailsChanged);
    } else {
        //we can just go ahead and change their status
        const changeOnlineStatus = yield apply(
            actions,
            actions.setColleagueConnectionStatus,
            [fromPeciaID, "CONNECTED", action.payload.connection.peer],
        );
        yield put(changeOnlineStatus);
    }
}

function* restoreVersion(action) {
    yield put({ type: "editor/restoreVersionByID", payload: action.payload });
    yield put({ type: "editor/initEditor", payload: { owner: "", title: "" } });
}
export default function* rootSaga() {
    yield takeEvery("peer/connect", connectToPeer);
    yield takeEvery("editor/restoreVersionPrep", restoreVersion);
    yield takeEvery("peer/connectionRequested", connectionRequested);
}
