import { useState, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";

const TaskContainer = ({ column }) => {
    const [ tasks, setTasks ] = useState([]);

    useEffect(() => {
        if (column) setTasks(column.Tasks);
    }, [column]);
    // console.log('@@@@@@@@@@', tasks)

  return (
    <div className="tasks-container">
      {tasks.map((task, index) => {
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
                  style={{
                    backgroundColor: snapshot.isDragging && "#d7d1f08a",
                    ...provided.draggableProps.style,
                  }}
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
  );
};

export default TaskContainer;
