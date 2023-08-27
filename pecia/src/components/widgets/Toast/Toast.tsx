import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../../state/slices/toast';
import './Toast.css';
import { RootState } from '../../../state/store';

const showToastsSelector = (state: RootState) => state.toast.showToasts;

const Toast = ({ type, children, toastID }) => {
    const showToasts = useSelector(showToastsSelector);

    const dispatch = useDispatch();

    const removeToast = () => {
        dispatch(actions.removeToast(toastID));
    };

    return (
        <>
            {showToasts && (
                <div className={`toast ${type}`}>
                    <div className="toast-body">{children}</div>
                    <button className="delete-toast" onClick={removeToast}>
                        x
                    </button>
                </div>
            )}
        </>
    );
};

export default Toast;
