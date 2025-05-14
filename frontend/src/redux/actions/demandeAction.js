import {
  getDemandesAdmin,
  changerStatutDemande,
} from "../../services/demandeService";

export const FETCH_DEMANDES_REQUEST = "FETCH_DEMANDES_REQUEST";
export const FETCH_DEMANDES_SUCCESS = "FETCH_DEMANDES_SUCCESS";
export const FETCH_DEMANDES_FAILURE = "FETCH_DEMANDES_FAILURE";

export const UPDATE_DEMANDE_STATUT = "UPDATE_DEMANDE_STATUT";

// Action pour charger les demandes
export const fetchDemandesAdmin = () => async (dispatch) => {
  dispatch({ type: FETCH_DEMANDES_REQUEST });
  try {
    const data = await getDemandesAdmin();
    dispatch({ type: FETCH_DEMANDES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_DEMANDES_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Action pour changer le statut d'une demande
export const updateDemandeStatut = (id, statut) => async (dispatch) => {
  try {
    const updated = await changerStatutDemande(id, statut);
    dispatch({ type: UPDATE_DEMANDE_STATUT, payload: updated });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
  }
};
