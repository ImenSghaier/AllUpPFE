import { 
  LOGIN_SUCCESS, 
  LOGIN_FAIL, 
  LOGOUT,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL
} from "../actions/authAction";

const initialState = {
  user: null,
  token: null,
  error: null,
  resetPasswordMessage: null,
  resetPasswordError: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { 
        ...state, 
        user: action.payload, 
        token: action.payload.token, 
        error: null 
      };
    case LOGIN_FAIL:
      return { 
        ...state, 
        error: action.payload 
      };
    case LOGOUT:
      return initialState;
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPasswordMessage: action.payload,
        resetPasswordError: null
      };
    case FORGOT_PASSWORD_FAIL:
      return {
        ...state,
        resetPasswordError: action.payload,
        resetPasswordMessage: null
      };
    default:
      return state;
  }
};

export default authReducer;