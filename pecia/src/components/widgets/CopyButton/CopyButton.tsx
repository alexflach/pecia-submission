import { useDispatch } from "react-redux";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { actions as toastActions } from "../../../state/slices/toast";

const CopyButton = ({ textToCopy }) => {
    const dispatch = useDispatch();
    const handleCopy = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy).then(
            () => {
                /* clipboard successfully set */
                dispatch(
                    toastActions.addToast("copied link to clipboard!", "info"),
                );
                dispatch(toastActions.showToasts());
            },
            () => {
                /* clipboard write failed */
                console.error(`failed to write ${textToCopy} to the clipboard`);
                dispatch(
                    toastActions.addToast(
                        `cannot copy, here's the link: ${textToCopy}`,
                        "warning",
                    ),
                );
                dispatch(toastActions.showToasts());
            },
        );
    };
    return (
        <button onClick={() => handleCopy(textToCopy)}>
            <FontAwesomeIcon icon={faClipboard} />
        </button>
    );
};

export default CopyButton;
