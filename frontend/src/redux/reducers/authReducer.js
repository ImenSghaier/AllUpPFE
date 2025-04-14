import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from "../actions/authAction";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        error: null,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case LOGOUT:  // Réinitialiser l'état de l'utilisateur lors de la déconnexion
      return {
        ...state,
        user: null,
        token: null,
        error: null,
      };
    default:
      return state;
  }
};

export default authReducer;
