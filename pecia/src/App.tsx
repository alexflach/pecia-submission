import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './state/store';
import usePeer from './hooks/usePeer';

import Header from './components/layout/Header/Header';
import ToastsPanel from './components/layout/Toasts';

import './App.css';
const selector = (state: RootState) => state.user.online;

function App() {
    const online = useSelector(selector);
    const dispatch = useDispatch();
    usePeer(online, dispatch);

    return (
        <div className="wrapper">
            <Header />
            <Outlet />
            <ToastsPanel />
        </div>
    );
}

export default App;
