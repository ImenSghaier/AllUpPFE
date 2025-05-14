import {
    getProfilEmploye,
    updateProfilEmploye,
  } from "../../services/profilService";
  
 

export const fetchProfil = (token) => async (dispatch) => {
  dispatch({ type: "FETCH_PROFIL_REQUEST" });

  try {
    const data = await getProfilEmploye(token);
    dispatch({ type: "FETCH_PROFIL_SUCCESS", payload: data });
  } catch (error) {
    dispatch({
      type: "FETCH_PROFIL_FAILURE",
      payload: error.response?.data?.message || "Erreur lors de la récupération du profil",
    });
  }
};

  
  export const updateProfil = (token, formData) => async (dispatch) => {
    try {
      const data = await updateProfilEmploye(token, formData);
      dispatch({ type: "UPDATE_PROFIL_SUCCESS", payload: data.utilisateur });
    } catch (error) {
      dispatch({ type: "UPDATE_PROFIL_ERROR", payload: error.message });
    }
  };
  