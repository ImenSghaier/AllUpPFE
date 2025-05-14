import { createDemande, getDemandesEmploye } from "../../services/demandeService";

// Action pour créer une demande
export const createDemandeAction = (token, demandeData) => async (dispatch) => {
  try {
    const response = await createDemande(token, demandeData);
    dispatch({
      type: "CREATE_DEMANDE_SUCCESS",
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: "CREATE_DEMANDE_FAILURE",
      error: error.response ? error.response.data : error.message,
    });
  }
};

// Action pour récupérer les demandes envoyées par un employé
export const getDemandesEmployeAction = (token) => async (dispatch) => {
  try {
    const response = await getDemandesEmploye(token);
    dispatch({
      type: "GET_DEMANDES_EMPLOYE_SUCCESS",
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: "GET_DEMANDES_EMPLOYE_FAILURE",
      error: error.response ? error.response.data : error.message,
    });
  }
};
