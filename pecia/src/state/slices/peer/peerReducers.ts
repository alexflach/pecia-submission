import { PayloadAction } from '@reduxjs/toolkit';

type ConnectionStatus = 'connected' | 'disconnected' | 'closed';

export type Connection = {
    id: string;
    username: string;
    passcode: string;
    status: ConnectionStatus;
    documents: string[];
};

export type PeerState = {
    connections: Connection[];
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
