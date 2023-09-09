import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import DocCard from "../DocCard";
import { RootState } from "../../../state/store";

import "./YourDocs.css";
import { actions } from "../../../state/slices/docs";

const docsSelector = (state: RootState) => state.docs.docs;

const YourDocs = () => {
    const docs = useSelector(docsSelector);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const newDocHandler = () => {
        const id = crypto.randomUUID();
        dispatch(actions.addDoc(id));
        navigate(`/edit?doc=${id}`);
    };
    return (
        <>
            <div className="docs-header">
                <h3 className="docs-title">Your Documents</h3>
                <button className="button" onClick={newDocHandler}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
            <div className="your-docs-banner">
                {docs &&
                    docs.map((doc) => (
                        <DocCard
                            key={doc.id}
                            title={doc.title}
                            onClick={() => {
                                navigate(`/edit?doc=${doc.id}`);
                            }}
                        />
                    ))}
            </div>
        </>
    );
};

export default YourDocs;
