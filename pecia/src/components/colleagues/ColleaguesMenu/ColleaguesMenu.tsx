import { useSelector, useDispatch } from 'react-redux';
import * as Tabs from '@radix-ui/react-tabs';

import { RootState } from '../../../state/store';
import ColleagueCard from '../ColleagueCard';
import AddColleagueButton from '../AddColleagueButton';
import { actions as toastActions } from '../../../state/slices/toast';
import { actions as peerActions } from '../../../state/slices/peer';

import './ColleaguesMenu.css';

const ColleaguesMenu = () => {
    const dispatch = useDispatch();
    const colleagues = useSelector((state: RootState) => state.peer.colleagues);


    const activeColleagues = colleagues.filter((colleague) => colleague.connectionStatus === 'CONNECTED');
    const inactiveColleagues = colleagues.filter((colleague) => colleague.connectionStatus !== 'CONNECTED');

    const addColleagueHandler = (username: string, passcode: string, peciaID: string) => {
        dispatch(
            peerActions.addColleague(username, passcode, peciaID)
        );
        dispatch(toastActions.addToast(`Added colleague ${username}!`, 'info'));
    };

    return (
        <div className="colleagues-wrapper">
            <div className="colleagues-header">
                <h5 className="colleagues-title">Colleagues</h5>
                <AddColleagueButton handler={addColleagueHandler} />
            </div>
            <Tabs.Root className="tabs-root" defaultValue="tab1">
                <Tabs.List
                    className="tabs-list"
                    aria-label="Browse Your Colleagues"
                >
                    <Tabs.Trigger className="tabs-trigger" value="tab1">
                        Connected Colleagues
                    </Tabs.Trigger>
                    <Tabs.Trigger className="tabs-trigger" value="tab2">
                        Disconnected Colleagues
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content className="tabs-content" value="tab1">
                    {activeColleagues &&
                        activeColleagues.map((colleague) => (
                            <ColleagueCard
                                key={colleague.peciaID}
                                colleague={colleague}
                            />
                        ))}
                    {!activeColleagues.length && (
                        <h5>No connected colleagues</h5>
                    )}
                </Tabs.Content>
                <Tabs.Content className="tabs-content" value="tab2">
                    {inactiveColleagues &&
                        inactiveColleagues.map((colleague) => (
                            <ColleagueCard
                                key={colleague.peciaID}
                                colleague={colleague}
                            />
                        ))}
                    {!inactiveColleagues.length && (
                        <h5>No disconnected Colleagues</h5>
                    )}
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
};

export default ColleaguesMenu;
