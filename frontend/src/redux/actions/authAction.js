import authService from "../../services/authService";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT = "LOGOUT";  // Action de déconnexion

export const login = (email, mot_de_passe, navigate) => async (dispatch) => {
  try {
    const data = await authService.login(email, mot_de_passe);
    console.log("Données reçues après connexion :", data);
    dispatch({ type: LOGIN_SUCCESS, payload: data });

    if (!data.role) {
      console.error("Le rôle est manquant !");
      return;
    }

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
    dispatch({ type: LOGIN_FAIL, payload: error.response?.data?.message || "Erreur de connexion" });
  }
};

// Action pour la déconnexion
export const logout = () => (dispatch) => {
  authService.logout();  // Appelle la méthode de déconnexion du service
  dispatch({ type: LOGOUT });  // Action Redux pour la déconnexion
};
