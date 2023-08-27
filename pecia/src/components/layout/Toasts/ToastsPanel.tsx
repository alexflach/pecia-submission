import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../state/store';
import Toast from '../../widgets/Toast';
import { actions } from '../../../state/slices/toast';

import './ToastsPanel.css';

const selector = (state: RootState) => state.toast;
const ToastsPanel = () => {
    const { toasts, showToasts } = useSelector(selector);
    const dispatch = useDispatch();

    return (
        <div
            className="toasts-container"
            data-state={showToasts ? 'active' : 'inactive'}
        >
            {toasts &&
                toasts.map((toast) => (
                    <Toast key={toast.id} type={toast.type} toastID={toast.id}>
                        {toast.message}
                    </Toast>
                ))}
            <div className="toasts-header">
                <h5>Notifications</h5>
                <button onClick={() => dispatch(actions.clearToasts())}>
                    Clear
                </button>
            </div>
        </div>
    );
};

export default ToastsPanel;
