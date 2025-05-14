import authService from "../../services/authService";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT = "LOGOUT";
export const FORGOT_PASSWORD_SUCCESS = "FORGOT_PASSWORD_SUCCESS";
export const FORGOT_PASSWORD_FAIL = "FORGOT_PASSWORD_FAIL";

// login existant
export const login = (email, mot_de_passe, navigate) => async (dispatch) => {
  try {
    const data = await authService.login(email, mot_de_passe);
    dispatch({ type: LOGIN_SUCCESS, payload: data });

    switch (data.role) {
      case "Administrateur":
        navigate("/admin");
        break;
      case "Fournisseur":
        navigate("/fournisseur");
        break;
      case "AdminEntreprise":
        navigate("/admin-entreprise");
        break;
      case "Employé":
        navigate("/employe");
        break;
      default:
        navigate("/");
    }
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response?.data?.message || "Erreur de connexion",
    });
  }
};

// 🔐 forgot-password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    const data = await authService.forgotPassword(email);
    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response?.data?.message || "Erreur lors de l'envoi de l'email",
    });
  }
};

// logout
export const logout = () => (dispatch) => {
  authService.logout();
  dispatch({ type: LOGOUT });
};
