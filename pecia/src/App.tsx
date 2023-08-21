import { Outlet } from 'react-router-dom';

import Header from './components/layout/Header/Header';

import './App.css';

function App() {
    return (
        <div className="wrapper">
            <Header />
            <Outlet />
        </div>
    );
}

export default App;
