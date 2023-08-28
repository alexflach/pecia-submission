import { Link, useLocation } from 'react-router-dom';
import User from '../../widgets/User';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import { actions as editorActions } from '../../../state/slices/editor';
import { actions as docsActions } from '../../../state/slices/docs';

import './Header.css';

const Header = () => {
    const { pathname } = useLocation();
    const dispatch = useDispatch();

    const { title, currentDocID } = useSelector(
        (state: RootState) => state.editor
    );

    const handleChange = (e) => {
        dispatch(editorActions.setTitle(e.target.value));
        dispatch(docsActions.setTitle(currentDocID, title));
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
                    value={title ? title : ''}
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
