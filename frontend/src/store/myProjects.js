import { csrfFetch } from "./csrf.js";

const LOAD_PROJECTS = "myProjects/loadProjects";
const ADD_PROJECT = "myProjects/addProject";
const REMOVE_PROJECT = "myProjects/removeProject";

const loadProjects = (projects) => ({
    type: LOAD_PROJECTS,
    payload: projects,
});

const addProject = (project) => ({
    type: ADD_PROJECT,
    payload: project,
});

const removeProject = (projectId) => ({
    type: REMOVE_PROJECT,
    payload: projectId,
});

//---------thunk actions------------------------------------------------

export const fetchAllMyProjects = () => async (dispatch) => {
  const response = await csrfFetch("/api/projects/mine");

  if (response.ok) {
    const data = await response.json();
    dispatch(loadProjects(data));
    return;
  }
};

export const createProject = (owner_id, name, description) => async (dispatch) => {
  const response = await csrfFetch("/api/projects", {
    method: "POST",
    body: JSON.stringify({
      owner_id,
      name,
      description
    }),
  });
    const project = await response.json();
    dispatch(addProject(project));
    return response;
};

export const deleteProject = (projectId) => async (dispatch) => {
  const response = await csrfFetch(`/api/projects/${projectId}`, {
    method: "DELETE"
  });
    if (response.ok)  dispatch(removeProject(projectId));
    return response;
};

//---------reducer------------------------------------------------

const initialState = {};

function reducer(state = initialState, action) {
  let newState;
  newState = Object.assign({}, state);
  switch (action.type) {
    case LOAD_PROJECTS:
      newState = action.payload
      return newState;
    case ADD_PROJECT:
      newState[action.payload.id] = action.payload;
      return newState;
    case REMOVE_PROJECT:
      delete newState[action.payload];
      return newState;
    default:
      return state;
  }
}

export default reducer;
