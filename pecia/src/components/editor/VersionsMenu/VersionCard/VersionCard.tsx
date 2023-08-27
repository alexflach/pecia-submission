import * as Collapsible from '@radix-ui/react-collapsible';
import { useState } from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VersionDeleteButton from '../VersionDeleteButton';
import RestoreVersionButton from '../RestoreVersionButton';

import './VersionCard.css';
import ShareVersionButton from '../ShareVersionButton';

export interface VersionCardProps {
    versionID: string;
    label: string;
    created: string;
    description: string;
}
const ICON_PROPS = {
    viewBox: '0 0 15 15',
    width: 20,
    height: 20,
};

const VersionCard = ({
    versionID,
    description,
    label,
    created,
}: VersionCardProps) => {
    const [open, setOpen] = useState(false);
    const handleDelete = () => {};
    const restoreVersion = () => {};
    const shareVersion = () => {};
    return (
        <div className="card-container">
            <Collapsible.Root
                className="collapsible-root"
                open={open}
                onOpenChange={setOpen}
            >
                <Collapsible.Trigger asChild>
                    <div className="card-header">
                        <span className="label">{label}</span>
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
                    <p className="description">{description}</p>
                    <span className="timestamp">{created}</span>
                    <div className="card-actions">
                        <VersionDeleteButton
                            handler={handleDelete}
                            ICON_PROPS={ICON_PROPS}
                        />
                        <RestoreVersionButton
                            versionID={versionID}
                            restoreVersion={restoreVersion}
                        />
                        <ShareVersionButton
                            versionID={versionID}
                            shareVersion={shareVersion}
                        />
                    </div>
                </Collapsible.Content>
            </Collapsible.Root>
        </div>
    );
};
export default VersionCard;
