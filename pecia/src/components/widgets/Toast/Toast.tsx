import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../../state/slices/toast';
import './Toast.css';
import { RootState } from '../../../state/store';

const showToastsSelector = (state: RootState) => state.toast.showToasts;

const Toast = ({ type, children, toastID, timestamp }) => {
    const showToasts = useSelector(showToastsSelector);

    const dispatch = useDispatch();

    const timeString = new Date(timestamp).toLocaleString();
    const removeToast = () => {
        dispatch(actions.removeToast(toastID));
    };

    return (
        <>
            {showToasts && (
                <div className={`toast ${type}`}>
                    <div className="toast-body">
                        {children}

                        <p className="toast-time">{timeString}</p>
                    </div>

                    <button className="delete-toast" onClick={removeToast}>
                        x
                    </button>
                </div>
            )}
        </>
    );
};

export default Toast;
