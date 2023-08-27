import * as Collapsible from '@radix-ui/react-collapsible';
import { useState } from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './VersionCard.css';

export interface VersionCardProps {
    title: string;
    id: string;
    label: string;
    created: string;
    description: string;
}
const VersionCard = ({
    title,
    id,
    description,
    label,
    created,
}: VersionCardProps) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="card-container">
            <Collapsible.Root
                className="collapsible-root"
                open={open}
                onOpenChange={setOpen}
            >
                <div className="card-header">
                    <span className="title">{title}</span>
                    <Collapsible.Trigger asChild>
                        <button className="card-button">
                            {
                                <FontAwesomeIcon
                                    icon={open ? faChevronUp : faChevronDown}
                                />
                            }
                        </button>
                    </Collapsible.Trigger>
                </div>
                <Collapsible.Content>
                    <p className="description">{description}</p>
                    <span className="timestamp">{created}</span>
                </Collapsible.Content>
            </Collapsible.Root>
        </div>
    );
};
export default VersionCard;
