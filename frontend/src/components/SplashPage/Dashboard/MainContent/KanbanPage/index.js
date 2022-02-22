import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './KanbanPage.css';
import ColumnTitle from "./ColumnTitle";
import { fetchOneKanbanById } from "../../../../../store/kanbans";
import AddColumn from "./AddColumn";
import AddTask from "./AddTask";

const KanbanPage = ({ params }) => {
    const dispatch = useDispatch();
    const { kanbanId } = params;
    const kanban = useSelector((state) => state.kanbans[kanbanId]);

    // when this component is loaded, dispatch to fetch kanban by id and added to redux store
    useEffect(() => {
        dispatch(fetchOneKanbanById(kanbanId))
    }, [kanbanId]);

    return (
        <>
            <DragDropContext>
                <div className="kanban-page">
                    {kanban && kanban.Columns.map(column => {
                        return (
                            <div className="column" key={`column-${column.id}`}>
                                <ColumnTitle column={column}/>
                                <AddTask column={column}/>
                                <div className="tasks-container">
                                    {column.Tasks.map(task => {
                                        return (
                                            <div key={`task-${task.id}`} className="task-card">
                                                {task.content}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                    <AddColumn kanban={kanban}/>
                </div>
            </DragDropContext>
        </>
    )
}

export default KanbanPage;
