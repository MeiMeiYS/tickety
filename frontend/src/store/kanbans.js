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

export const fetchOneKanbanById = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/kanbans/${id}`);

  if (response.ok) {
    const kanban = await response.json();
    console.log(kanban)
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
