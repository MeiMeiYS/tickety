import { useState, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

const TaskContainer = ({ column }) => {
  const [tasks, setTasks] = useState([]);


  useEffect(() => {
    if (column) setTasks(column.Tasks);
  }, [column]);

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
                  <TaskCard task={task} />
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
