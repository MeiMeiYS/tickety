import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ThreeDotsButton from "../ThreeDotsButton";
import { editColumn, deleteColumn, fetchOneKanbanById } from "../../../../../store/kanbans";


const ColumnTitle = ({ column }) => {
    const dispatch = useDispatch();
    const [ errors, setErrors ] = useState([]);
    const [ name, setName ] = useState(column.name);
    const [ viewOnlyMode, setViewOnlyMode ] = useState(true);
    const [ showConfirmDelete, setShowConfirmDelete ] = useState(false);

    const showEditForm = e => {
        e.preventDefault();
        setViewOnlyMode(false);
    }

    const closeEditForm = e => {
        e.preventDefault();
        setViewOnlyMode(true);
    }

    const showDeleteButton = e => {
        e.preventDefault();
        setShowConfirmDelete(true);
    }

    const hideDeleteButton = e => {
        e.preventDefault();
        setShowConfirmDelete(false);
    }

    const handleEditColumn = e => {
        e.preventDefault();
        dispatch(editColumn(column.id, column.kanban_id, name))
        .then(() => {
            setViewOnlyMode(true);
            // update column redux store
            dispatch(fetchOneKanbanById(column.kanban_id));
        })
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
        });
    }

    const handleDelete = e => {
        e.preventDefault();
        dispatch(deleteColumn(column.id))
        .then(() => {
            setShowConfirmDelete(false);
            // update column redux store
            dispatch(fetchOneKanbanById(column.kanban_id));
        })
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
        });
    }

    return (
        <>
            <div className="column-title">
                {viewOnlyMode ? <h3>{column.name} {column.column_index} {column.id}</h3> :
                <form onSubmit={handleEditColumn} >
                    <div className="input-container-name">
                        <input
                        placeholder="Column name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        />
                    </div>
                    <button className='cancel' type="button" onClick={closeEditForm}>Cancel</button>
                    <button className='submit' type="submit">Save</button>
                </form>
                }
                <ThreeDotsButton thisElement='column'showEditForm={showEditForm} showDeleteButton={showDeleteButton}/>
            </div>
            {showConfirmDelete &&
                <div className='confirm-delete'>
                    <p id="confirm-delete-text">Are you sure you want to permanently delete this Column and all the tasks in it?</p>
                    <div className="btn-group">
                        <button type='button' onClick={hideDeleteButton} className="cancel">Maybe later</button>
                        <button className='delete' type='button' onClick={handleDelete}>Confirm delete</button>
                    </div>
                </div>
            }
        </>
    )
}

export default ColumnTitle;
