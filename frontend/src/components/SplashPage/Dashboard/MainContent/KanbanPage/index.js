import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './KanbanPage.css';
import ColumnTitle from "./ColumnTitle";
import { fetchOneKanbanById } from "../../../../../store/kanbans";


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
                                <div className="tasks-container">

                                </div>
                            </div>
                        )
                    })}

                    <button className="new-column">
                        <i className="fa-solid fa-plus"></i>
                        <span>Add column</span>
                    </button>
                </div>
            </DragDropContext>
        </>
    )
}

export default KanbanPage;
