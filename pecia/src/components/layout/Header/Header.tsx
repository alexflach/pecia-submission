import { Link, useLocation } from 'react-router-dom';
import User from '../../widgets/User';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import { actions } from '../../../state/slices/docs';

import './Header.css';

const Header = () => {
    const { pathname } = useLocation();
    const dispatch = useDispatch();

    const docs = useSelector((state: RootState) => state.docs.docs);
    const docID = useSelector((state: RootState) => state.editor.currentDocID);
    const doc = docs.find((doc) => doc.id === docID);
    const title = doc ? doc.title : '';

    const handleChange = (e) => {
        dispatch(actions.setTitle(docID, e.target.value));
    };

    return (
        <header>
            <Link to="/">
                <h3>Pecia</h3>
            </Link>
            {pathname === '/edit' && (
                <input
                    className="title-input"
                    type="text"
                    value={title}
                    placeholder="enter title..."
                    maxLength={30}
                    onChange={handleChange}
                ></input>
            )}

            <User />
        </header>
    );
};

export default Header;
