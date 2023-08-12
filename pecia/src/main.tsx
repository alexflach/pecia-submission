import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx';
import HomePage from './components/pages/HomePage';
import ErrorPage from './components/pages/ErrorPage';
import DocsPage from './components/pages/DocsPage';
import UserPage from './components/pages/UserPage';
import './index.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'docs/:docID/edit',
                element: <DocsPage />,
            },
            {
                path: 'docs',
                element: <DocsPage />,
            },
            {
                path: 'user',
                element: <UserPage />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
