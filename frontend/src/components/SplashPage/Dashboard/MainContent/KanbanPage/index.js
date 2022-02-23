import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "./KanbanPage.css";
import ColumnTitle from "./ColumnTitle";
import { fetchOneKanbanById, moveTask } from "../../../../../store/kanbans";
import AddColumn from "./AddColumn";
import AddTask from "./AddTask";
import TaskContainer from "./TaskContainer";

const KanbanPage = ({ params }) => {
  const dispatch = useDispatch();
  const { kanbanId } = params;
  const kanban = useSelector((state) => state.kanbans[kanbanId]);

  const [ columns, setColumns ] = useState([]);
  const [ errors, setErrors ] = useState([]);

  // when this component is loaded, dispatch to fetch kanban by id and added to redux store
  useEffect(() => {
    dispatch(fetchOneKanbanById(kanbanId));
  }, [kanbanId]);

  useEffect(() => {
    if (kanban) setColumns(kanban.Columns);
}, [kanban]);
  const onDragEnd = result => {
    if (!result.destination) return;
    const fromColumnId = result.source.droppableId;
    const fromTaskIndex = result.source.index;
    let fromColumnIndex;
    const toColumnId = result.destination.droppableId;
    const toTaskIndex = result.destination.index;
    let toColumnIndex;

    columns.forEach((column, i) => {
        if (column.id === parseInt(fromColumnId, 10)) fromColumnIndex = i;
        if (column.id === parseInt(toColumnId, 10)) toColumnIndex = i;
    })

    if (fromColumnIndex === toColumnIndex && fromTaskIndex === toTaskIndex)  return;

    const targetTask = columns[fromColumnIndex].Tasks[fromTaskIndex];
    const newColumns = columns.slice();
    newColumns[fromColumnIndex].Tasks.splice(fromTaskIndex, 1);
    newColumns[toColumnIndex].Tasks.splice(toTaskIndex, 0, targetTask);
    setColumns(newColumns);

    return dispatch(moveTask(result.draggableId, result.destination.droppableId, result.destination.index))
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
            columns.map((column) => {
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
                        <TaskContainer column={column}/>

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
