import { test, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../utils/testUtils.tsx";
import ColleagueMessage from "./ColleagueMessage.tsx";
import { PreloadedState } from "@reduxjs/toolkit";
import { RootState } from "../../../state/store.ts";
import { UserMessage } from "../../../state/slices/peer/peerReducers.ts";

const preloadedMessage: UserMessage = {
    type: "INFO",
    id: "abc",
    message: "Test message",
    summary: "Summary",
    timestamp: 100,
    rejection: "REJECT_CHANGE",
    peciaID: "100",
    action: "APPROVE_CHANGE",
};
const preloadedState: PreloadedState<RootState> = {
    peer: {
        colleagues: [],
        packets: [],
        connections: [],
        colleagueRequests: [],
        connectionErrors: [],
        requestedConnections: [],
        requestedDocs: [],
        peerErrors: [],
        showWarning: false,
        showError: false,
        messages: [preloadedMessage],
        showMessages: false,
    },
};
test("renders component with overlay behaviour", async () => {
    renderWithProviders(<ColleagueMessage message={preloadedMessage} />, {
        preloadedState,
    });

    expect(screen.queryAllByTitle("confirm").length).toBe(0);
    // @ts-expect-error The toBeInTheDocument is not being picked up by TS
    expect(screen.getByTitle("details")).toBeInTheDocument();
    expect(
        await screen.findByText(preloadedMessage.summary),
        // @ts-expect-error The toBeInTheDocument is not being picked up by TS
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));

    expect(
        await screen.findByText(preloadedMessage.message),
        // @ts-expect-error The toBeInTheDocument is not being picked up by TS
    ).toBeInTheDocument();

    // @ts-expect-error The toBeInTheDocument is not being picked up by TS
    expect(screen.getByTitle("reject")).toBeInTheDocument();

    // @ts-expect-error The toBeInTheDocument is not being picked up by TS
    expect(screen.getByTitle("approve")).toBeInTheDocument();
});

test("can reject message and remove it from list", async () => {
    const { store } = renderWithProviders(
        <ColleagueMessage message={preloadedMessage} />,
        {
            preloadedState,
        },
    );

    const initialState = store.getState();
    const messages = initialState.peer.messages;

    expect(messages.length).toBe(1);

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByTitle("reject"));

    const newState = store.getState();
    const newMessages = newState.peer.messages;

    expect(newMessages.length).toBe(0);
});

test("can approve message and remove it from list", async () => {
    const { store } = renderWithProviders(
        <ColleagueMessage message={preloadedMessage} />,
        {
            preloadedState,
        },
    );

    const initialState = store.getState();
    const messages = initialState.peer.messages;

    expect(messages.length).toBe(1);

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByTitle("approve"));

    const newState = store.getState();
    const newMessages = newState.peer.messages;

    expect(newMessages.length).toBe(0);
});
