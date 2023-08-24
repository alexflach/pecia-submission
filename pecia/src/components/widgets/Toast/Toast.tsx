import { useDispatch } from 'react-redux';
import { actions } from '../../../state/slices/toast';
import './Toast.css';

const Toast = ({ type, children, toastID }) => {
    const dispatch = useDispatch();

    const removeToast = () => {
        dispatch(actions.removeToast(toastID));
    };
    return (
        <div className={`toast ${type}`}>
            <div className="toast-body">{children}</div>
            <button className="delete-toast" onClick={removeToast}>
                x
            </button>
        </div>
    );
};

export default Toast;
