import { useState } from 'react';
import { useDispatch } from 'react-redux';
// import { RootState } from '../../../../state/store';
// import { actions } from '../../../../state/slices/editor';
// import { actions as toastActions } from '../../../../state/slices/toast';
import { actions } from '../../../state/slices/peer'
import * as Collapsible from '@radix-ui/react-collapsible';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Colleague} from "../../../state/slices/peer/peerReducers.ts";
import EditColleagueButton from "../EditColleagueButton/EditColleagueButton.tsx";
import DeleteColleagueButton from "../DeleteColleagueButton";
import EditSharedDocsButton from "../EditSharedDocsButton";
import ConnectButton from "../ConnectButton";

import './ColleagueCard.css';
import {Doc} from "../../../state/slices/docs/docsReducers.ts";


const ColleagueCard = ({ colleague}: {colleague: Colleague}) => {
   const dispatch = useDispatch();
   const [open, setOpen] = useState(false);
   const updateColleagueHandler = (username, passcode, newPeciaID) => {
       dispatch(actions.updateColleague(username, passcode, colleague.peciaID, newPeciaID))
   }
   const deleteColleagueHandler = () => {
       dispatch(actions.deleteColleague(colleague.peciaID))
   }

   const updateDocsHandler = (docs: Doc[]) => {
       dispatch(actions.updateColleagueDocs(colleague.peciaID, docs))
   }

   const connectToPeer = (peerID: string) => {
       dispatch(actions.connectionRequested(peerID, colleague.passcode, colleague.username, colleague.peciaID));
   }
   return (
        <div
            className="card-container"
        >
            <Collapsible.Root
                className="collapsible-root"
                open={open}
                onOpenChange={setOpen}
            >
                <Collapsible.Trigger asChild>
                    <div className="card-header">
                        <span className="label">{colleague.username}</span>
                        <button className="card-button">
                            {
                                <FontAwesomeIcon
                                    icon={open ? faChevronUp : faChevronDown}
                                />
                            }
                        </button>
                    </div>
                </Collapsible.Trigger>
                <Collapsible.Content>
                    <p className="passcode">Passcode: {colleague.passcode}</p>
                    {!!colleague.docs.length && <p>Shared docs:</p>}
                    {!!colleague.docs.length && colleague.docs.map(doc=> (<p>{doc}</p>))}
                    <div className="card-actions">

                        <DeleteColleagueButton handler={deleteColleagueHandler} />
                        <EditColleagueButton handler={updateColleagueHandler} colleague={colleague} />
                        <EditSharedDocsButton handler={updateDocsHandler} colleague={colleague}/>
                        <ConnectButton handler={connectToPeer} />
                    </div>
                </Collapsible.Content>
            </Collapsible.Root>
        </div>
    );
};
export default ColleagueCard;
