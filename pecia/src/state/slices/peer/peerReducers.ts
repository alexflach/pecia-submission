import { Dispatch, PayloadAction } from "@reduxjs/toolkit";
import Peer, { DataConnection } from "peerjs";
import { Doc } from "../docs/docsReducers.ts";

type ConnectionStatus = "CONNECTED" | "PENDING" | "DISCONNECTED";

type ColleagueStatus = "INVITED" | "PENDING" | "CONNECTED" | "REJECTED";

export interface Colleague {
    peciaID: string;
    username: string;
    passcode: string;
    peerID: string;
    docs: string[];
    status: ColleagueStatus;
    connectionStatus: ConnectionStatus;
}

export interface Connection {
    id: string;
    username: string;
    passcode: string;
    status: ConnectionStatus;
    documents: string[];
}

export interface PeerError {
    type: string;
    message: string;
}

export type DataPacketTypes = "doc" | "syn" | "ack" | "chat";

export interface DataPacket {
    type: DataPacketTypes;
    message: string;
    time: number;
    sender: string;
}

type MessageType = "INFO" | "WARNING" | "ERROR";
type MessageActionType = "APPROVE_NEW" | "APPROVE_CHANGE" | "NONE";

export interface UserMessage {
    type: MessageType;
    message: string;
    id: string;
    timestamp: number;
    action: MessageActionType;
}

export interface PeerState {
    colleagues: Colleague[];
    colleagueRequests: Colleague[];
    connections: Connection[];
    requestedConnections: Connection[];
    peerErrors: PeerError[];
    connectionErrors: PeerError[];
    messages: UserMessage[];
    showMessages: boolean;
    showWarning: boolean;
    showError: boolean;
    packets: DataPacket[];
}

export const addColleague = {
    reducer: (state: PeerState, action: PayloadAction<Colleague>) => {
        state.colleagues.push(action.payload);
    },
    prepare: (username: string, passcode: string, peciaID) => {
        const payload: Colleague = {
            username,
            passcode,
            peciaID,
            peerID: "",
            docs: [],
            status: "PENDING",
            connectionStatus: "DISCONNECTED",
        };
        return {
            payload,
        };
    },
};

export const updateColleague = {
    reducer: (state: PeerState, action) => {
        state.colleagues = state.colleagues.map((colleague) => {
            if (colleague.peciaID === action.payload.oldPeciaID) {
                return {
                    ...colleague,
                    username: action.payload.username,
                    passcode: action.payload.passcode,
                    peciaID: action.payload.newPeciaID,
                };
            } else return colleague;
        });
    },
    prepare: (
        username: string,
        passcode: string,
        oldPeciaID: string,
        newPeciaID: string,
    ) => {
        return {
            payload: {
                username,
                passcode,
                oldPeciaID,
                newPeciaID,
            },
        };
    },
};

export const updateColleagueDocs = {
    reducer: (state: PeerState, action) => {
        state.colleagues = state.colleagues.map((colleague) =>
            colleague.peciaID === action.payload.colleagueID
                ? {
                      ...colleague,
                      docs: action.payload.docs,
                  }
                : colleague,
        );
    },
    prepare: (colleagueID: string, docs: Doc[]) => {
        return {
            payload: {
                colleagueID,
                docs,
            },
        };
    },
};

export interface ColleagueConnectionPayload {
    peciaID: string;
    peerID: string;
    status: ConnectionStatus;
}
export const setColleagueConnectionStatus = {
    reducer: (
        state: PeerState,
        action: PayloadAction<ColleagueConnectionPayload>,
    ) => {
        state.colleagues = state.colleagues.map((colleague) =>
            colleague.peciaID === action.payload.peciaID
                ? {
                      ...colleague,
                      connectionStatus: action.payload.status,
                      peerID: action.payload.peerID,
                  }
                : colleague,
        );
    },
    prepare: (peciaID: string, status: ConnectionStatus, peerID: string) => {
        return {
            payload: {
                peciaID,
                peerID,
                status,
            },
        };
    },
};

export const deleteColleague = (
    state: PeerState,
    action: PayloadAction<string>,
) => {
    state.colleagues = state.colleagues.filter(
        (colleague) => colleague.peciaID !== action.payload,
    );
};

export interface ConnectionRequestedPayload {
    peer: Peer;
    connection: DataConnection;
    dispatch: Dispatch;
    connections: DataConnection[];
}
export const connectionRequested = {
    reducer: (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _state: PeerState,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _action: PayloadAction<ConnectionRequestedPayload>,
    ) => {},
    prepare: (
        peer: Peer,
        connection: DataConnection,
        dispatch: Dispatch,
        connections: DataConnection[],
    ) => {
        return {
            payload: {
                peer,
                connection,
                dispatch,
                connections,
            },
        };
    },
};

export const newColleagueRequest = {
    reducer: (state: PeerState, action: PayloadAction<Colleague>) => {
        state.colleagueRequests.push(action.payload);
        const message: UserMessage = {
            id: crypto.randomUUID(),
            type: "INFO",
            action: "APPROVE_NEW",
            timestamp: Date.now(),
            message: `Colleague request from:
            Username: ${action.payload.username},
            Passcode: ${action.payload.passcode},
            PeciaID: ${action.payload.peciaID}`,
        };
        state.messages.push(message);
    },
    prepare: (colleague: Colleague) => {
        return {
            payload: {
                ...colleague,
            },
        };
    },
};

export interface ColleagueChangedPayload {
    peciaID: string;
    username: string;
    passcode: string;
}

export const colleagueDetailsChanged = {
    reducer: (
        state: PeerState,
        action: PayloadAction<ColleagueChangedPayload>,
    ) => {
        state.colleagues = state.colleagues.map((colleague) => {
            if (!(colleague.peciaID === action.payload.peciaID))
                return colleague;
            else
                return {
                    ...colleague,
                    status: "PENDING",
                    username: action.payload.username,
                    passcode: action.payload.passcode,
                };
        });

        const oldDetails = state.colleagues.find(
            (colleague) => colleague.peciaID === action.payload.peciaID,
        );
        const message: UserMessage = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            message: `Colleague details changed:
            Old Username: ${oldDetails.username}
            New Username: ${action.payload.username}
            
            Old Passcode: ${oldDetails.passcode}
            New Passcode: ${action.payload.passcode}`,
            type: "WARNING",
            action: "APPROVE_CHANGE",
        };
        state.messages.push(message);
    },
    prepare: (peciaID: string, username: string, passcode: string) => {
        return {
            payload: {
                peciaID,
                username,
                passcode,
            },
        };
    },
};

export const dataReceived = (
    state: PeerState,
    action: PayloadAction<DataPacket>,
) => {
    state.packets.push(action.payload);
};

export const connectionOpen = (
    state: PeerState,
    action: PayloadAction<string>,
) => {
    state.colleagues = state.colleagues.map((colleague) =>
        colleague.peerID === action.payload
            ? {
                  ...colleague,
                  connectionStatus: "CONNECTED",
              }
            : colleague,
    );
};
export const connectionClosed = (
    state: PeerState,
    action: PayloadAction<string>,
) => {
    state.colleagues = state.colleagues.map((colleague) =>
        colleague.peerID === action.payload
            ? {
                  ...colleague,
                  connectionStatus: "DISCONNECTED",
              }
            : colleague,
    );
};

export const connectionErrorReported = (
    state: PeerState,
    action: PayloadAction<PeerError>,
) => {
    if (
        !state.connectionErrors.find(
            (err) =>
                err.message === action.payload.message &&
                err.type === action.payload.type,
        )
    ) {
        state.connectionErrors.push(action.payload);
        console.log("didn't find");
    }
};

export const peerErrorReported = (
    state: PeerState,
    action: PayloadAction<PeerError>,
) => {
    state.peerErrors.push(action.payload);
};

export interface ConnectToPeerPayload {
    peer: Peer;
    peerID: string;
    toPeciaID: string;
    toUsername: string;
    toPasscode: string;
    fromPeciaID: string;
    fromUsername: string;
    fromPasscode: string;
    dispatch: Dispatch;
    connections: DataConnection[];
}

export const connect = {
    reducer: (
        state: PeerState,
        action: PayloadAction<ConnectToPeerPayload>,
    ) => {
        console.log(state, action);
    },
    prepare: (
        peer: Peer,
        peerID: string,
        toPeciaID: string,
        toUsername: string,
        toPasscode: string,
        fromPeciaID: string,
        fromUsername: string,
        fromPasscode: string,
        dispatch: Dispatch,
        connections: DataConnection[],
    ) => {
        return {
            payload: {
                peer,
                peerID,
                toPeciaID,
                toUsername,
                toPasscode,
                fromPeciaID,
                fromUsername,
                fromPasscode,
                dispatch,
                connections,
            },
        };
    },
};

export const toggleMessages = (state: PeerState) => {
    state.showMessages = !state.showMessages;
};

export const showMessages = (state: PeerState) => {
    state.showMessages = true;
};

export const hideMessages = (state: PeerState) => {
    state.showMessages = false;
};

export const addMessage = {
    reducer: (state: PeerState, action: PayloadAction<UserMessage>) => {
        state.messages.push(action.payload);
        switch (action.payload.type) {
            case "WARNING":
                state.showWarning = true;
                break;
            case "ERROR":
                state.showError = true;
                break;
            default:
                break;
        }
    },
    prepare: (
        message: string,
        type: MessageType,
        action: MessageActionType,
    ) => {
        return {
            payload: {
                message,
                type,
                action,
                id: crypto.randomUUID(),
                timestamp: Date.now(),
            },
        };
    },
};

export const removeMessage = (
    state: PeerState,
    action: PayloadAction<string>,
) => {
    const newMessages = state.messages.filter((m) => m.id !== action.payload);
    state.messages = newMessages;
    if (!newMessages.length) state.showMessages = false;
    if (!newMessages.find((message) => message.type === "WARNING")) {
        state.showWarning = false;
    }
    if (!newMessages.find((message) => message.type === "ERROR")) {
        state.showError = false;
    }
};

export const clearMessages = (state: PeerState) => {
    state.messages = [];
    state.showWarning = false;
    state.showError = false;
    state.showMessages = false;
};
