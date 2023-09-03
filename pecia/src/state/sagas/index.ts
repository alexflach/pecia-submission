import { select, takeEvery, apply, call, put } from "redux-saga/effects";
import {
    ConnectToPeerPayload,
    ConnectionRequestedPayload,
    Colleague,
    DataReceivedPayload,
    MessageResolutionPayload,
    DataPacket,
} from "../slices/peer/peerReducers.ts";
import { bootstrapConnection, ConnectionMetadata } from "../slices/peer/utils";
import { RootState } from "../store.ts";
import { actions } from "../slices/peer";
import { actions as editorActions } from "../slices/editor";
import { actions as docsActions } from "../slices/docs";
import { PayloadAction } from "@reduxjs/toolkit";
import { Replica } from "../../lib/crdt/replica.ts";
import { DataConnection } from "peerjs";

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
        yield call(bootstrapConnection, connection, dispatch, toPeciaID);
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

function* manageDataReceipt(action: PayloadAction<DataReceivedPayload>) {
    const { packet, sender } = action.payload;
    const state: RootState = yield select();
    const docs = state.docs.docs;
    let version: Replica, docID: string, matchedDoc;
    let knownVersionIDs: string[];
    let retrievedVersionsString, newVersionsString: string;
    let retrievedVersions, newVersions: Replica[];
    let alreadyKnown;
    let foundColleague;
    switch (packet.type) {
        case "APPROVED":
            yield apply(actions, actions.addMessage, [
                packet.message,
                "colleague request approved!",
                "INFO",
                "NONE",
                "NONE",
                packet.sender,
            ]);
            break;
        case "REJECTED":
            yield apply(actions, actions.addMessage, [
                packet.message,
                "colleague request rejected!",
                "WARNING",
                "NONE",
                "NONE",
                packet.sender,
            ]);
            break;
        case "VERSION":
            //if the sender is not an approved colleague, we ignore.
            foundColleague = yield apply(
                state.peer.colleagues,
                state.peer.colleagues.find,
                [(c) => c.peciaID === sender && c.status === "CONFIRMED"],
            );
            if (!foundColleague) return;

            //check if we know the document.
            version = yield apply(JSON, JSON.parse, [packet.message]);
            docID = version.docID;
            matchedDoc = yield apply(docs, docs.find, [
                (doc) => doc.id === docID,
            ]);
            //if we don't know the doc handle a new doc flow
            if (!matchedDoc) {
                const newDocAction = apply(
                    actions,
                    actions.newDocumentRequest,
                    [sender, version],
                );
                yield put(newDocAction);
            }
            //if we do know it check if we have the version already if we do ignore
            else {
                //check if the doc is the currently active doc, if so memory is master
                if (docID === state.editor.currentDocID) {
                    knownVersionIDs = yield apply(
                        state.editor.versions,
                        state.editor.versions.map,
                        [(version) => version.versionID],
                    );
                } else {
                    //local storage is master
                    retrievedVersionsString = yield apply(
                        localStorage,
                        localStorage.getItem,
                        [`pecia-versions-${docID}`],
                    );
                    if (retrievedVersionsString) {
                        retrievedVersions = yield apply(JSON, JSON.parse, [
                            retrievedVersionsString,
                        ]);
                    }
                    if (retrievedVersions) {
                        knownVersionIDs = yield apply(
                            retrievedVersions,
                            retrievedVersions.map,
                            [(v) => v.versionID],
                        );
                    }
                }
                alreadyKnown = yield apply(
                    knownVersionIDs,
                    knownVersionIDs.find,
                    [(v) => v === version.versionID],
                );
                if (alreadyKnown) return;
                else {
                    //if we are currently editing the doc the editor state needs to be updated with the new version.
                    if (docID === state.editor.currentDocID) {
                        //editor add remote version
                        const addRemote = yield apply(
                            editorActions,
                            editorActions.addRemoteVersion,
                            [version],
                        );
                        yield put(addRemote);
                    } else {
                        //otherwise we are going to add the version to those in local storage for retrieval
                        newVersions = yield apply(
                            retrievedVersions,
                            retrievedVersions.push,
                            [version],
                        );
                        newVersionsString = yield apply(JSON, JSON.stringify, [
                            newVersions,
                        ]);
                        yield apply(localStorage, localStorage.setItem, [
                            `pecia-versions=${docID}`,
                            newVersionsString,
                        ]);
                    }
                }
            }
            break;
        default:
            break;
    }
}

function* manageDocApproval(action: {
    type: string;
    payload: MessageResolutionPayload;
}) {
    let docsAction;
    let candidateVersions: Replica[];
    let matchedVersion: Replica;
    const message = action.payload.message;
    let versionString: string;
    switch (action.payload.resolution) {
        case "APPROVE_DOC":
            //add doc to list of docs
            candidateVersions = yield select(
                (state: RootState) => state.peer.requestedDocs,
            );
            matchedVersion = yield apply(
                candidateVersions,
                candidateVersions.find,
                [(v) => v.versionID === message.versionID],
            );
            if (!matchedVersion) return;
            docsAction = yield apply(docsActions, docsActions.addDoc, [
                matchedVersion.docID,
                matchedVersion.title,
            ]);
            yield put(docsAction);
            versionString = yield apply(JSON, JSON.stringify, [
                [matchedVersion],
            ]);
            //save version
            yield apply(localStorage, localStorage.setItem, [
                `pecia-versions-${matchedVersion.docID}`,
                versionString,
            ]);
            break;
        default:
            break;
    }
}

//loops through colleagues that we are sharing the doc with, and sends them the shared version.
function* shareVersion(action: {
    type: string;
    payload: { version: Replica; connections: DataConnection[] };
}) {
    const docID = action.payload.version.docID;
    const colleagues: Colleague[] = yield select(
        (state: RootState) => state.peer.colleagues,
    );

    const user = yield select((state: RootState) => state.user);
    const versionString = yield apply(JSON, JSON.stringify, [
        action.payload.version,
    ]);
    const data: DataPacket = {
        type: "VERSION",
        time: Date.now(),
        sender: user.peciaID,
        message: versionString,
    };

    const matchedColleagues: Colleague[] = yield apply(
        colleagues,
        colleagues.filter,
        [(colleague) => colleague.docs.find((doc) => doc === docID)],
    );

    for (const colleague of matchedColleagues) {
        const connection: DataConnection = yield apply(
            action.payload.connections,
            action.payload.connections.find,
            [(c) => c.peer === colleague.peerID],
        );
        if (!connection) continue;

        yield apply(connection, connection.send, [data]);
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
    yield takeEvery("peer/dataReceived", manageDataReceipt);
    yield takeEvery("peer/resolveMessage", manageDocApproval);
    yield takeEvery("peer/shareVersion", shareVersion);
}
