import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import ThreeDotsButton from "../ThreeDotsButton";
import { editTask, deleteTask, fetchOneKanbanById } from "../../../../../store/kanbans";

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();

  const [errors, setErrors] = useState([]);
  const [viewOnlyMode, setViewOnlyMode] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [content, setContent] = useState(task.content);

  const showEditForm = (e) => {
    e.preventDefault();
    setViewOnlyMode(false);
  };

  const closeEditForm = (e) => {
    e.preventDefault();
    setViewOnlyMode(true);
    setErrors([]);
  };

  const showDeleteButton = (e) => {
    e.preventDefault();
    setShowConfirmDelete(true);
  };

  const hideDeleteButton = (e) => {
    e.preventDefault();
    setShowConfirmDelete(false);
  };

  const handleEditTask = (e) => {
    e.preventDefault();
    dispatch(editTask(task.id, task.column_id, content.trim()))
    .then(() => {
        setViewOnlyMode(true);
        // update column redux store
        dispatch(fetchOneKanbanById(task.kanban_id));
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteTask(task.id))
      .then(() => {
        // update column redux store
        dispatch(fetchOneKanbanById(task.kanban_id));
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  return (
    <>
      <div className="content-container">
        {showConfirmDelete && (
          <div className="confirm-delete">
            <p id="confirm-delete-text">Task will be permanently deleted.</p>
            <div className="btn-group">
              <button
                type="button"
                onClick={hideDeleteButton}
                className="cancel"
              >
                Maybe later
              </button>
              <button className="delete" type="button" onClick={handleDelete}>
                Confirm delete
              </button>
            </div>
          </div>
        )}
        <p>{`task_index ${task.task_index}`}</p>
        <p>{`task_id ${task.id}`}</p>
        <p>{`column_id ${task.column_id}`}</p>
        {viewOnlyMode ? (
          <p>{task.content}</p>
        ) : (
          <form onSubmit={handleEditTask}>
            <ul>
              {errors.map((error, idx) => (
                <li className="error-message" key={idx}>
                  {error}
                </li>
              ))}
            </ul>
            <div className="input-container-content">
              <textarea
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <div className="btn-group">
                <button className="cancel" type="button" onClick={closeEditForm}>Cancel</button>
                <button className="submit" type="submit">Save</button>
            </div>
          </form>
        )}
      </div>
      <ThreeDotsButton
        thisElement="task"
        showEditForm={showEditForm}
        showDeleteButton={showDeleteButton}
      />
    </>
  );
};

export default TaskCard;
