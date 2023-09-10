import { test, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../utils/testUtils.tsx";
import ColleagueCard from "./ColleagueCard.tsx";
import { PreloadedState } from "@reduxjs/toolkit";
import { RootState } from "../../../state/store.ts";
import { Colleague } from "../../../state/slices/peer/peerReducers.ts";

const preloadedColleague: Colleague = {
    peciaID: "a",
    username: "Alice",
    passcode: "secret",
    peerID: "peer",
    docs: [],
    status: "CONFIRMED",
    connectionStatus: "CONNECTED",
};
const preloadedState: PreloadedState<RootState> = {
    peer: {
        colleagues: [preloadedColleague],
        packets: [],
        connections: [],
        colleagueRequests: [],
        connectionErrors: [],
        requestedConnections: [],
        requestedDocs: [],
        peerErrors: [],
        showWarning: false,
        showError: false,
        messages: [],
        showMessages: false,
    },
};
test("renders component with expand and collapse on click", () => {
    renderWithProviders(<ColleagueCard colleague={preloadedColleague} />, {
        preloadedState,
    });

    expect(screen.queryAllByTitle("collapse").length).toBe(0);
    // @ts-expect-error The toBeInTheDocument is not being picked up by TS
    expect(screen.getByTitle("expand")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));

    // @ts-expect-error The toBeInTheDocument is not being picked up by TS
    expect(screen.getByTitle("collapse")).toBeInTheDocument();
    expect(screen.queryAllByTitle("expand").length).toBe(0);
    fireEvent.click(screen.getByTitle("collapse"));
    expect(screen.queryAllByTitle("collapse").length).toBe(0);

    // @ts-expect-error The toBeInTheDocument is not being picked up by TS
    expect(screen.getByTitle("expand")).toBeInTheDocument();
});

test("can delete colleague", () => {
    const { store } = renderWithProviders(
        <ColleagueCard colleague={preloadedColleague} />,
        {
            preloadedState,
        },
    );

    const initialState = store.getState();
    expect(initialState.peer.colleagues.length).toBe(1);
    //expand the UI
    fireEvent.click(screen.getByRole("button"));

    //click the delete button
    fireEvent.click(screen.getByTitle("delete colleague"));

    //confirm
    fireEvent.click(screen.getByTitle("confirm"));

    const state: RootState = store.getState();

    expect(state.peer.colleagues.length).toBe(0);
});

test("can edit colleague", () => {
    const NEW_USERNAME = "Bob";
    const NEW_PASSCODE = "Password";
    const NEW_PECIA_ID = "9999";

    const { store } = renderWithProviders(
        <ColleagueCard colleague={preloadedColleague} />,
        { preloadedState },
    );
    const initialState = store.getState();
    const initialColleague = initialState.peer.colleagues[0];

    expect(initialState.peer.colleagues.length).toBe(1);
    expect(initialColleague.username).toBe(preloadedColleague.username);
    expect(initialColleague.passcode).toBe(preloadedColleague.passcode);
    expect(initialColleague.peciaID).toBe(preloadedColleague.peciaID);

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByTitle("edit colleague"));
    fireEvent.input(screen.getByTitle("username"), {
        target: { value: NEW_USERNAME },
    });
    fireEvent.input(screen.getByTitle("passcode"), {
        target: { value: NEW_PASSCODE },
    });
    fireEvent.input(screen.getByTitle("pecia ID"), {
        target: { value: NEW_PECIA_ID },
    });
    fireEvent.click(screen.getByTitle("confirm"));

    const newState = store.getState();
    const newColleague = newState.peer.colleagues[0];

    expect(newState.peer.colleagues.length).toBe(1);
    expect(newColleague.username).toBe(NEW_USERNAME);
    expect(newColleague.passcode).toBe(NEW_PASSCODE);
    expect(newColleague.peciaID).toBe(NEW_PECIA_ID);
});
