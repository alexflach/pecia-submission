import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./state/store.ts";

import App from "./App.tsx";
import HomePage from "./components/pages/HomePage";
import ErrorPage from "./components/pages/ErrorPage";
import DocsPage from "./components/pages/DocsPage";
import UserPage from "./components/pages/UserPage";
import EditorPage from "./components/pages/EditorPage";
import NotFoundPage from "./components/pages/NotFoundPage/NotFoundPage.tsx";

import "./index.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "edit",
                element: <EditorPage />,
            },
            {
                path: "docs",
                element: <DocsPage />,
            },
            {
                path: "user",
                element: <UserPage />,
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>,
);
