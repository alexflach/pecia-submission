import * as CheckBox from '@radix-ui/react-checkbox';
import {CheckIcon} from '@radix-ui/react-icons';

import './DocLine.css';

const DocLine = ({docID, title, handler, checked}) => {
    console.log(checked);
    return (
        <div className="checkbox-wrapper">
            <label className="checkbox-label" htmlFor={docID}>{title}</label>
            <CheckBox.Root className="checkbox-root" id={docID} checked={checked} onCheckedChange={handler}>
               <CheckBox.Indicator className="checkbox-indicator">
                   <CheckIcon />
               </CheckBox.Indicator>
            </CheckBox.Root>
        </div>
    )
}

export default DocLine;
