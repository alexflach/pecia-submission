import { Dispatch, PayloadAction } from '@reduxjs/toolkit';
import Peer, { DataConnection } from 'peerjs';
import {Doc} from "../docs/docsReducers.ts";

type ConnectionStatus = 'CONNECTED' | 'PENDING' | 'DISCONNECTED';

type ColleagueStatus = 'INVITED' | 'PENDING' | 'CONNECTED' | 'REJECTED'
export interface Colleague {
    peciaID: string,
    username: string,
    passcode: string,
    peerID: string,
    docs: string[],
    status: ColleagueStatus,
    connectionStatus: ConnectionStatus
}

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

export type PeerMessageTypes = 'doc' | 'syn' | 'ack' | 'chat';

export type DataPacket = {
    type: PeerMessageTypes;
    message: string;
    time: number;
    sender: string;
};

export type PeerState = {
    colleagues: Colleague[];
    connections: Connection[];
    requestedConnections: Connection[];
    peerErrors: PeerError[];
    connectionErrors: PeerError[];
    messages: DataPacket[];
};


export const addColleague = {
    reducer: (state: PeerState, action: PayloadAction<Colleague>) => {
        state.colleagues.push(action.payload);
    },
    prepare: (username: string, passcode: string, peciaID) => {
        const payload: Colleague = {
            username,
            passcode,
            peciaID,
            peerID: '',
            docs: [],
            status: 'PENDING',
            connectionStatus: 'DISCONNECTED'

        }
        return {
            payload
        }
    }
}

export const updateColleague = {
    reducer: (state: PeerState, action) => {
        state.colleagues = state.colleagues.map(colleague=> {
            if(colleague.peciaID === action.payload.oldPeciaID) {
                return {
                    ...colleague,
                    username: action.payload.username,
                    passcode: action.payload.passcode,
                    peciaID: action.payload.newPeciaID
                }
            } else return colleague;
        })
    },
    prepare: (username: string, passcode: string, oldPeciaID: string, newPeciaID: string) => {
        return {
            payload: {
                username, passcode, oldPeciaID, newPeciaID
            }
        }
    }
}

export const updateColleagueDocs = {
    reducer: (state: PeerState, action) => {
        state.colleagues = state.colleagues.map(colleague=> (
            colleague.peciaID === action.payload.colleagueID ? {...colleague, docs: action.payload.docs} : colleague
        ))

    },
    prepare: (colleagueID: string, docs: Doc[]) => {
        return {
            payload: {
                colleagueID,
                docs
            }
        }
    }
}

export const deleteColleague = (state: PeerState, action: PayloadAction<string>) => {
    state.colleagues = state.colleagues.filter(colleague=>colleague.peciaID !== action.payload)
}

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
            status: 'CONNECTED',
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
