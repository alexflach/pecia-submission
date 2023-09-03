import { createSlice } from "@reduxjs/toolkit";
import {
    PeerState,
    connect,
    connectionErrorReported,
    peerErrorReported,
    dataReceived,
    connectionRequested,
    connectionClosed,
    connectionOpen,
    addColleague,
    updateColleague,
    deleteColleague,
    updateColleagueDocs,
    newColleagueRequest,
    colleagueDetailsChanged,
    setColleagueConnectionStatus,
    toggleMessages,
    showMessages,
    hideMessages,
    addMessage,
    removeMessage,
    resolveMessage,
    clearMessages,
    newDocumentRequest,
} from "./peerReducers";

let initialColleagues = [];

try {
    const retrievedColleagues = localStorage.getItem("pecia-colleagues");
    if (retrievedColleagues) {
        const parsedColleagues = JSON.parse(retrievedColleagues);
        initialColleagues = parsedColleagues.map((colleague) => ({
            ...colleague,
            connectionStatus: "DISCONNECTED",
            peerID: "",
        }));
    }
} catch (error) {
    console.error(error);
}

const initialState: PeerState = {
    connections: [],
    requestedConnections: [],
    peerErrors: [],
    connectionErrors: [],
    messages: [],
    showMessages: false,
    showError: false,
    showWarning: false,
    packets: [],
    colleagues: initialColleagues,
    colleagueRequests: [],
    requestedDocs: [],
};
const peerSlice = createSlice({
    name: "peer",
    initialState,
    reducers: {
        addColleague,
        updateColleague,
        updateColleagueDocs,
        deleteColleague,
        connect,
        connectionRequested,
        connectionClosed,
        connectionOpen,
        connectionErrorReported,
        peerErrorReported,
        dataReceived,
        newColleagueRequest,
        colleagueDetailsChanged,
        setColleagueConnectionStatus,
        toggleMessages,
        hideMessages,
        showMessages,
        addMessage,
        removeMessage,
        resolveMessage,
        clearMessages,
        newDocumentRequest,
    },
});

export default peerSlice;
