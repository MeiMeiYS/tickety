import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createColumn } from "../../../../../store/kanbans";
import { fetchOneKanbanById } from "../../../../../store/kanbans";

const AddColumn = ({ kanban }) => {
    const dispatch = useDispatch();
    const [ showAddColumnForm, setShowAddColumnForm ] = useState(false);
    const [ errors, setErrors ] = useState([]);
    const [ name, setName ] = useState('');

    const displayAddColumnForm = e => {
        e.preventDefault();
        setShowAddColumnForm(true);
    }

    const hideAddColumnForm = e => {
        e.preventDefault();
        setShowAddColumnForm(false);
        setName('');
        setErrors([]);
    }

    const handleCreateColumn = e => {
        e.preventDefault();
        dispatch(createColumn(kanban.project_id, kanban.id, name))
        .then(() => {
            setShowAddColumnForm(false);
            setName('');
            // update column redux store
            dispatch(fetchOneKanbanById(kanban.id));
        })
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
        });
    }

    return (
        <div className="new-column" >
            {showAddColumnForm ?
            <form onSubmit={handleCreateColumn}>
                <ul>
                    {errors.map((error, idx) => (
                        <li className="error-message" key={idx}>{error}</li>
                    ))}
                </ul>
                <div>
                    <div className="input-container-name">
                        <input
                        placeholder="Column name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        />
                    </div>
                    <button className='cancel' type="button" onClick={hideAddColumnForm}>Cancel</button>
                    <button className='submit' type="submit">Add</button>
                </div>
            </form>
            :
                <>
                    <i className="fa-solid fa-plus"></i>
                    <button className="add-btn" type="button" onClick={displayAddColumnForm}>Add column</button>
                </>
            }
        </div>
    )
}

export default AddColumn;
