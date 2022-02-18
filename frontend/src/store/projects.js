import { csrfFetch } from "./csrf.js";

const LOAD_PROJECTS = "projects/loadProjects";
const ADD_PROJECT = "projects/addProject";
// const REMOVE_PROJECT = "projects/removeProject";

const loadProjects = (projects) => ({
    type: LOAD_PROJECTS,
    payload: projects,
});

const addProject = (project) => ({
    type: ADD_PROJECT,
    payload: project,
});

// const removeProject = (id) => ({
//     type: REMOVE_PROJECT,
//     payload: id,
// });

//---------thunk actions------------------------------------------------

export const fetchAllProjects = () => async (dispatch) => {
  const response = await csrfFetch("/api/projects");

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
    // case REMOVE_PROJECT:
    //   newState = Object.assign({}, state, { user: null });
    //   return newState;
    default:
      return state;
  }
}

export default reducer;
