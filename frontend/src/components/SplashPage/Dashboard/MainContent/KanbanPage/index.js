import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./KanbanPage.css";
import ColumnTitle from "./ColumnTitle";
import { fetchOneKanbanById, moveTask } from "../../../../../store/kanbans";
import AddColumn from "./AddColumn";
import AddTask from "./AddTask";

const KanbanPage = ({ params }) => {
  const dispatch = useDispatch();
  const { kanbanId } = params;
  const kanban = useSelector((state) => state.kanbans[kanbanId]);
  const [ errors, setErrors ] = useState([]);

  // when this component is loaded, dispatch to fetch kanban by id and added to redux store
  useEffect(() => {
    dispatch(fetchOneKanbanById(kanbanId));
  }, [kanbanId]);

  const onDragEnd = result => {
    console.log(result);
    if (!result.destination) return;
    dispatch(moveTask(result.draggableId, result.destination.droppableId, result.destination.index))
    .then(() => {
        // update column redux store
        dispatch(fetchOneKanbanById(kanbanId));
    })
    .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
    });
  }

  return (
    <>
      <div className="kanban-page">
        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
          {kanban &&
            kanban.Columns.map((column) => {
              return (
                <Droppable key={`column-${column.id}`} droppableId={`${column.id}`}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="column"
                        style={{background: snapshot.isDraggingOver && '#f9f9f9', overflowY: "scroll"}}
                      >
                        <ColumnTitle column={column} />
                        <AddTask column={column} />
                        <div className="tasks-container">
                          {column.Tasks.map((task, index) => {
                            return (
                              <Draggable
                                key={`task-${task.id}`}
                                draggableId={`${task.id}`}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="task-card"
                                      style={{backgroundColor: snapshot.isDragging && '#d7d1f08a', ...provided.draggableProps.style}}
                                    >
                                      <p>{`task_index ${task.task_index}`}</p>
                                      <p>{`task_id ${task.id}`}</p>
                                      <p>{`column_id ${task.column_id}`}</p>
                                      {task.content}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                        </div>
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              );
            })}
          <AddColumn kanban={kanban} />
        </DragDropContext>
      </div>
    </>
  );
};

export default KanbanPage;
