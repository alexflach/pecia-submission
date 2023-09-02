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
import './ColleagueCard.css';

const ColleagueCard = ({ colleague}: {colleague: Colleague}) => {
   const dispatch = useDispatch();
   const [open, setOpen] = useState(false);
   const updateColleagueHandler = (username, passcode, newPeciaID) => {
       dispatch(actions.updateColleague(username, passcode, colleague.peciaID, newPeciaID))
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
                    <span className="passcode">{colleague.passcode}</span>
                    <div className="card-actions">
                        <EditColleagueButton handler={updateColleagueHandler} colleague={colleague} />

                    </div>
                </Collapsible.Content>
            </Collapsible.Root>
        </div>
    );
};
export default ColleagueCard;
