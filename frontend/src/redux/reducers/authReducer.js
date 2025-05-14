import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
} from "../actions/authAction";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  error: null,
  message: null, // Pour afficher les messages de succès (ex: forgot password)
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
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        error: null,
      };
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        message: action.payload,
        error: null,
      };
    case FORGOT_PASSWORD_FAIL:
      return {
        ...state,
        error: action.payload,
        message: null,
      };
    default:
      return state;
  }
};

export default authReducer;

