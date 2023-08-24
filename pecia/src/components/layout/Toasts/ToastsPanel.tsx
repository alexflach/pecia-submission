import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import Toast from '../../widgets/Toast';

import './ToastsPanel.css';

const selector = (state: RootState) => state.toast.toasts;
const ToastsPanel = () => {
    const toasts = useSelector(selector);

    return (
        <div
            className="toasts-container"
            data-state={toasts && toasts.length ? 'active' : 'inactive'}
        >
            {toasts &&
                toasts.map((toast) => (
                    <Toast key={toast.id} type={toast.type} toastID={toast.id}>
                        {toast.message}
                    </Toast>
                ))}
        </div>
    );
};

export default ToastsPanel;
