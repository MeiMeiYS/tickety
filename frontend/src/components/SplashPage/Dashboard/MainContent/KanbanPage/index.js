import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './KanbanPage.css';
import ColumnTitle from "./ColumnTitle";
import { fetchOneKanbanById } from "../../../../../store/kanbans";
import { createColumn } from "../../../../../store/kanbans";


const KanbanPage = ({ params }) => {
    const dispatch = useDispatch();
    const { kanbanId } = params;
    const kanban = useSelector((state) => state.kanbans[kanbanId]);
    const [showAddColumnForm, setShowAddColumnForm] = useState(false);
    const [ errors, setErrors ] = useState([]);
    const [ name, setName ] = useState('');


    // when this component is loaded, dispatch to fetch kanban by id and added to redux store
    useEffect(() => {
        dispatch(fetchOneKanbanById(kanbanId))
    }, [kanbanId]);

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
        <>
            <DragDropContext>
                <div className="kanban-page">
                    {kanban && kanban.Columns.map(column => {
                        return (
                            <div className="column" key={`column-${column.id}`}>
                                <ColumnTitle column={column}/>
                                <div className="tasks-container">

                                </div>
                            </div>
                        )
                    })}

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
                </div>
            </DragDropContext>
        </>
    )
}

export default KanbanPage;
