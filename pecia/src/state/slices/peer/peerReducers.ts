import { Dispatch, PayloadAction } from '@reduxjs/toolkit';
import Peer, { DataConnection } from 'peerjs';

type ConnectionStatus = 'connected' | 'disconnected' | 'closed';

export type Connection = {
    id: string;
    username: string;
    passcode: string;
    status: ConnectionStatus;
    documents: string[];
};

export type PeerError = {
    type: string;
    message: string;
};

export type PeerMessageTypes = 'doc' | 'syn' | 'ack';

export type DataPacket = {
    type: PeerMessageTypes;
    message: string;
    time: number;
    sender: string;
};

export type PeerState = {
    connections: Connection[];
    requestedConnections: Connection[];
    peerErrors: PeerError[];
    connectionErrors: PeerError[];
    messages: DataPacket[];
};

export const addConnection = {
    reducer: (state: PeerState, action: PayloadAction<Connection>) => {
        state.connections.push(action.payload);
    },
    prepare: (id: string, doc: string) => {
        return {
            payload: {
                id,
                documents: [doc],
                status: 'connected' as ConnectionStatus,
                username: '',
                passcode: '',
            } as Connection,
        };
    },
};

export const removeConnection = (
    state: PeerState,
    action: PayloadAction<string>
) => {
    state.connections = state.connections.filter(
        (connection) => connection.id !== action.payload
    );
};

export const updateConnectionStatus = {
    reducer: (
        state: PeerState,
        action: PayloadAction<{ id: string; status: ConnectionStatus }>
    ) => {
        state.connections = state.connections.map((connection) =>
            connection.id === action.payload.id
                ? { ...connection, status: action.payload.status }
                : connection
        );
    },
    prepare: (id: string, status: ConnectionStatus) => {
        return { payload: { id, status } };
    },
};

export const updateConnectionUsername = {
    reducer: (
        state: PeerState,
        action: PayloadAction<{ id: string; username: string }>
    ) => {
        state.connections = state.connections.map((connection) =>
            connection.id === action.payload.id
                ? { ...connection, username: action.payload.username }
                : connection
        );
    },
    prepare: (id: string, username: string) => {
        return { payload: { id, username } };
    },
};

export const updateConnectionPasscode = {
    reducer: (
        state: PeerState,
        action: PayloadAction<{ id: string; passcode: string }>
    ) => {
        state.connections = state.connections.map((connection) =>
            connection.id === action.payload.id
                ? { ...connection, passcode: action.payload.passcode }
                : connection
        );
    },
    prepare: (id: string, passcode: string) => {
        return { payload: { id, passcode } };
    },
};

export const connectionRequested = {
    reducer(
        state: PeerState,
        action: PayloadAction<{
            id: string;
            passcode: string;
            username: string;
            docID: string;
        }>
    ) {
        state.requestedConnections.push({
            id: action.payload.id,
            username: action.payload.username,
            passcode: action.payload.passcode,
            documents: [action.payload.docID],
            status: 'connected',
        });
    },
    prepare: (id: string, passcode: string, username: string, docID) => {
        return {
            payload: {
                id,
                passcode,
                username,
                docID,
            },
        };
    },
};

export const dataReceived = (
    state: PeerState,
    action: PayloadAction<DataPacket>
) => {
    state.messages.push(action.payload);
};

export const connectionErrorReported = (
    state: PeerState,
    action: PayloadAction<PeerError>
) => {
    state.connectionErrors.push(action.payload);
};

export const peerErrorReported = (
    state: PeerState,
    action: PayloadAction<PeerError>
) => {
    state.peerErrors.push(action.payload);
};
export const connect = {
    reducer: (
        state: PeerState,
        action: PayloadAction<{
            peer: Peer;
            id: string;
            username: string;
            passcode: string;
            doc: string;
            dispatch: Dispatch;
            connections: DataConnection[];
        }>
    ) => {
        console.log(state, action);
    },
    prepare: (
        peer: Peer,
        id: string,
        username: string,
        passcode: string,
        doc: string,
        dispatch: Dispatch,
        connections: DataConnection[]
    ) => {
        return {
            payload: {
                peer,
                id,
                username,
                passcode,
                doc,
                dispatch,
                connections,
            },
        };
    },
};
