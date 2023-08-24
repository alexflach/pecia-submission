import { Outlet, useOutletContext } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './state/store';
import Peer from 'peerjs';
import usePeer from './hooks/usePeer';

import Header from './components/layout/Header/Header';
import ToastsPanel from './components/layout/Toasts';

import './App.css';
const selector = (state: RootState) => state.user.online;

function App() {
    const online = useSelector(selector);
    const dispatch = useDispatch();
    const peer = usePeer(online, dispatch);

    return (
        <div className="wrapper">
            <Header />
            <Outlet context={{ peer }} />
            <ToastsPanel />
        </div>
    );
}

export default App;

type ContextType = {
    peer: React.MutableRefObject<Peer>;
};

export const usePeerContext = () => {
    return useOutletContext<ContextType>();
};
