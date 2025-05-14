import serviceFOffre from "../../services/offreFService";

// Types d'actions
export const OFFRE_LOADING = "OFFRE_LOADING";
export const OFFRE_ERROR = "OFFRE_ERROR";
export const GET_OFFRES_SUCCESS = "GET_OFFRES_SUCCESS";
export const GET_OFFRE_SUCCESS = "GET_OFFRE_SUCCESS";
export const ADD_OFFRE_SUCCESS = "ADD_OFFRE_SUCCESS";
export const UPDATE_OFFRE_SUCCESS = "UPDATE_OFFRE_SUCCESS";
export const DELETE_OFFRE_SUCCESS = "DELETE_OFFRE_SUCCESS";

// Actions pour les offres
export const getOffres = (queryParams = {}) => async (dispatch) => {
  dispatch({ type: OFFRE_LOADING });
  try {
    const data = await serviceFOffre.getOffres(queryParams);
    dispatch({ type: GET_OFFRES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: OFFRE_ERROR, payload: error.message });
  }
};

export const getOffresPaginated = (queryParams = {}) => async (dispatch) => {
  dispatch({ type: OFFRE_LOADING });
  try {
    const data = await serviceFOffre.getOffresPaginated(queryParams);
    dispatch({ type: GET_OFFRES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: OFFRE_ERROR, payload: error.message });
  }
};

export const getOffreById = (id) => async (dispatch) => {
  dispatch({ type: OFFRE_LOADING });
  try {
    const data = await serviceFOffre.getOffreById(id);
    dispatch({ type: GET_OFFRE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: OFFRE_ERROR, payload: error.message });
  }
};

export const addOffre = (offreData, imageUri) => async (dispatch) => {
  dispatch({ type: OFFRE_LOADING });
  try {
    const data = await serviceFOffre.addOffre(offreData, imageUri);
    dispatch({ type: ADD_OFFRE_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: OFFRE_ERROR, payload: error.message });
    throw error;
  }
};

export const updateOffre = (id, updatedData) => async (dispatch) => {
  dispatch({ type: OFFRE_LOADING });
  try {
    const data = await serviceFOffre.updateOffre(id, updatedData);
    dispatch({ type: UPDATE_OFFRE_SUCCESS, payload: { id, data } });
    return data;
  } catch (error) {
    dispatch({ type: OFFRE_ERROR, payload: error.message });
    throw error;
  }
};

export const deleteOffre = (id) => async (dispatch) => {
  dispatch({ type: OFFRE_LOADING });
  try {
    const data = await serviceFOffre.deleteOffre(id);
    dispatch({ type: DELETE_OFFRE_SUCCESS, payload: id });
    return data;
  } catch (error) {
    dispatch({ type: OFFRE_ERROR, payload: error.message });
    throw error;
  }
};