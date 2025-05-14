// redux/actions/offreActions.js
import { getOffresActivesEmploye , getOffresInactivesEmploye } from "../../services/offreService";

export const getOffresEmploye = (token) => async (dispatch) => {
  try {
    dispatch({ type: "OFFRE_EMPLOYE_REQUEST" });

    const data = await getOffresActivesEmploye(token);

    dispatch({ type: "OFFRE_EMPLOYE_SUCCESS", payload: data });
  } catch (error) {
    dispatch({
      type: "OFFRE_EMPLOYE_FAIL",
      payload:
        error.response?.data?.message || error.message || "Erreur serveur",
    });
  }
};
export const getOffresInactivesEmployeAction = (token) => async (dispatch) => {
  try {
    dispatch({ type: "OFFRE_EMPLOYE_INACTIVE_REQUEST" });

    const data = await getOffresInactivesEmploye(token);

    dispatch({ type: "OFFRE_EMPLOYE_INACTIVE_SUCCESS", payload: data });
  } catch (error) {
    dispatch({
      type: "OFFRE_EMPLOYE_INACTIVE_FAIL",
      payload:
        error.response?.data?.message || error.message || "Erreur serveur",
    });
  }
};
