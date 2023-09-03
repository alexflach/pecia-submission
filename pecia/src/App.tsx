import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./state/store";
import usePeer from "./hooks/usePeer";

import Header from "./components/layout/Header/Header";
import ToastsPanel from "./components/layout/Toasts";

import "./App.css";
import ColleagueMessages from "./components/colleagues/ColleagueMessages";
const selector = (state: RootState) => state.user.online;

function App() {
    const online = useSelector(selector);
    const dispatch = useDispatch();
    const peer = usePeer(online, dispatch);

    return (
        <div className="wrapper">
            <Header />
            <Outlet context={peer} />
            <ToastsPanel />
            <ColleagueMessages />
        </div>
    );
}

export default App;
