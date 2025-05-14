import authService from "../../services/authService";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT = "LOGOUT";
export const FORGOT_PASSWORD_SUCCESS = "FORGOT_PASSWORD_SUCCESS";
export const FORGOT_PASSWORD_FAIL = "FORGOT_PASSWORD_FAIL";

export const login = (email, mot_de_passe, navigation) => async (dispatch) => {
  try {
    const data = await authService.login(email, mot_de_passe);
    dispatch({ type: LOGIN_SUCCESS, payload: data });

    switch (data.role) {
      case "Employé":
        navigation.replace("Employe");
        break;
      case "Fournisseur":
        navigation.replace("Fournisseur");
        break;
      default:
        // si admin, ignorer
        break;
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAIL, payload: "Email ou mot de passe invalide" });
  }
};

export const logout = () => async (dispatch) => {
  await authService.logout();
  dispatch({ type: LOGOUT });
};

export const forgotPassword = (email) => async (dispatch) => {
  try {
    const response = await authService.forgotPassword(email);
    dispatch({ 
      type: FORGOT_PASSWORD_SUCCESS, 
      payload: response.message || "Un email de réinitialisation a été envoyé" 
    });
    return response;
  } catch (error) {
    dispatch({ 
      type: FORGOT_PASSWORD_FAIL, 
      payload: error.toString() 
    });
    throw error;
  }
};