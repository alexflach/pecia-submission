import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './EditSharedDocsButton.css';
import {useSelector} from 'react-redux';
import {RootState} from "../../../state/store.ts";
import {useState} from "react";

import DocLine from "./DocLine";
import {Doc} from "../../../state/slices/docs/docsReducers.ts";


const EditSharedDocsButton = ({ handler, colleague }) => {
    const docs = useSelector((state: RootState) => state.docs.docs)
    const [selectedDocs, setSelectedDocs] = useState(() => colleague.docs as Doc[])
    const changeCheckedStatus = (checked, docID) => {
        if(checked) {
            setSelectedDocs((docs) => (docs.find((doc) => doc === docID) ? docs : [...docs, docID]))
        }
        else {
            setSelectedDocs((docs) => docs.filter((doc)=> !doc === docID))
        }
    }

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger className="alert-trigger">
                <FontAwesomeIcon icon={faFileLines} size="xl" />
            </AlertDialog.Trigger>
            <AlertDialog.Overlay className="alert-dialog-overlay" />
            <AlertDialog.Content className="alert-dialog-content">
                <AlertDialog.Title className="alert-dialog-title">
                    Edit Docs
                </AlertDialog.Title>
                <AlertDialog.Description className="alert-dialog-description">
                    Select the docs you would like to share with {colleague.username}
                </AlertDialog.Description>
                <div className="docs-container">
                    {docs && docs.map((doc)=> {
                        return (<DocLine key={doc.id} title={doc.title} handler={(checked: boolean) => changeCheckedStatus(checked, doc.id)}  checked={!!selectedDocs.find((d)=> d === doc.id)} docID={doc.id} />)}
                    )}
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: 25,
                        justifyContent: 'flex-end',
                    }}
                >
                    <AlertDialog.Cancel asChild>
                        <button className="button">Cancel</button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                        <button
                            onClick={() => {
                                handler(selectedDocs);
                            }}
                            className="button green"
                        >
                            Update Docs
                        </button>
                    </AlertDialog.Action>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

export default EditSharedDocsButton;
