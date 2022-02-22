import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTask, fetchOneKanbanById } from "../../../../../store/kanbans";

const AddTask = ({ column }) => {
    const dispatch = useDispatch();
    const [ errors, setErrors ] = useState([]);
    const [ showNewTaskForm, setShowNewTaskForm ] = useState(false);
    const [ content, setContent ] = useState('');

    const handleShowForm = e => {
        e.preventDefault();
        setShowNewTaskForm(preState => !preState);
        if (!showNewTaskForm) setContent('');
    }

    const handleAddTask = e => {
        e.preventDefault();
        dispatch(createTask(column.id, content.trim()))
        .then(() => {
            setShowNewTaskForm(false);
            setContent('');
            setErrors([]);
            // update column redux store
            dispatch(fetchOneKanbanById(column.kanban_id));
        })
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
        });

    }

    return (
        <div className="add-task">
            <div className="title" onClick={handleShowForm}>
                { showNewTaskForm ? <i className="fa-solid fa-angle-down"></i> : <i className="fa-solid fa-plus"></i>}
                <p>Add new task</p>
            </div>
            { showNewTaskForm &&
                <form onSubmit={handleAddTask} >
                    <ul>
                        {errors.map((error, idx) => <li className="error-message" key={idx}>{error}</li>)}
                    </ul>
                    <div className="input-container-content">
                        <textarea
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        // required
                        />
                    </div>
                    <button className='submit' type="submit">Add</button>
                </form>
            }
        </div>
    )
}

export default AddTask;
