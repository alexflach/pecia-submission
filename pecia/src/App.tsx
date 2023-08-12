import { Outlet } from 'react-router-dom';

import './App.css';

function App() {
    return (
        <>
            <h1>Pecia Editor</h1>
            <Outlet />
        </>
    );
}

export default App;
