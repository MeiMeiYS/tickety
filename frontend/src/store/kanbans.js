import { csrfFetch } from "./csrf.js";

const ADD_KANBAN = "kanbans/addkanban";
const REMOVE_KANBAN = "kanbans/removeKanban";

const addkanban = (kanban) => ({
    type: ADD_KANBAN,
    payload: kanban,
});

const removeKanban = (kanbanId) => ({
    type: REMOVE_KANBAN,
    payload: kanbanId,
});

//---------thunk actions------------------------------------------------

//---------kanbans------------------------------------------------

export const fetchOneKanbanById = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/kanbans/${id}`);

  if (response.ok) {
    const kanban = await response.json();
    dispatch(addkanban(kanban));
    return;
  }
  return response;
};

export const createKanban = (project_id, name, description) => async (dispatch) => {
  const response = await csrfFetch("/api/kanbans", {
    method: "POST",
    body: JSON.stringify({
      project_id,
      name,
      description
    }),
  });
    const kanban = await response.json();
    if (response.ok){
      dispatch(addkanban(kanban));
      return kanban
    }
    return response;
};

export const editKanban = (project_id, kanban_id, name, description) => async (dispatch) => {
  const response = await csrfFetch(`/api/kanbans/${kanban_id}`, {
    method: "PUT",
    body: JSON.stringify({
      project_id,
      kanban_id,
      name,
      description
    }),
  });
  const kanban = await response.json();
  if (response.ok) {
    dispatch(addkanban(kanban));
  }
  return response;
};

export const deleteKanban = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/kanbans/${id}`, {
    method: "DELETE"
  });
    if (response.ok)  dispatch(removeKanban(id));
    return response;
};

//---------columns------------------------------------------------

export const createColumn = (project_id, kanban_id, name) => async (dispatch) => {
  const response = await csrfFetch("/api/columns", {
    method: "POST",
    body: JSON.stringify({
      project_id,
      kanban_id,
      name
    }),
  });

    return response;
};

export const editColumn = (column_id, kanban_id, name) => async (dispatch) => {
  const response = await csrfFetch(`/api/columns/${column_id}`, {
    method: "PUT",
    body: JSON.stringify({
      kanban_id,
      name,
    }),
  });

  return response;
};

export const deleteColumn = (column_id) => async (dispatch) => {
  const response = await csrfFetch(`/api/columns/${column_id}`, {
    method: "DELETE",
  });

    return response;
};

//---------tasks------------------------------------------------

export const createTask = (column_id, content) => async (dispatch) => {
  const response = await csrfFetch("/api/tasks", {
    method: "POST",
    body: JSON.stringify({
      column_id,
      content
    }),
  });

    return response;
};

export const moveTask = (task_id, newColumnId, newIndex) => async (dispatch) => {
  const response = await csrfFetch(`/api/tasks/${task_id}`, {
    method: "PUT",
    body: JSON.stringify({
      newColumnId,
      newIndex
    }),
  });

    return response;
};

export const editTask = (task_id, column_id, content) => async (dispatch) => {
  const response = await csrfFetch(`/api/tasks/${task_id}/content`, {
    method: "PUT",
    body: JSON.stringify({
      column_id,
      content
    }),
  });

    return response;
};

export const deleteTask = (task_id) => async (dispatch) => {
  const response = await csrfFetch(`/api/tasks/${task_id}`, {
    method: "DELETE",
  });

    return response;
};

//---------reducer------------------------------------------------

const initialState = {};

function reducer(state = initialState, action) {
  let newState;
  newState = Object.assign({}, state);
  switch (action.type) {
    case ADD_KANBAN:
      newState[action.payload.id] = action.payload;
      return newState;
    case REMOVE_KANBAN:
      delete newState[action.payload];
      return newState;
    default:
      return state;
  }
}

export default reducer;
