// Following guidance from redux docs:
// https://redux.js.org/usage/writing-tests
import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { PreloadedState } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";

import { AppTestStore, RootState, setupTestStore } from "../state/store.ts";
import Peer from "peerjs";

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
    preloadedState?: PreloadedState<RootState>;
    store?: AppTestStore;
}

const mockPeerContext = { peer: new Peer(), connections: [] };

export function renderWithProviders(
    ui: React.ReactElement,
    {
        preloadedState = {},
        // Automatically create a store instance if no store was passed in
        store = setupTestStore(preloadedState),
        ...renderOptions
    }: ExtendedRenderOptions = {},
) {
    function Wrapper({ children }: PropsWithChildren<object>): JSX.Element {
        return (
            <Provider store={store}>
                <MemoryRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={<Outlet context={mockPeerContext} />}
                        >
                            <Route index element={children} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
    }

    // Return an object with the store and all of RTL's query functions
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
