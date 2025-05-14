const initialState = {
    loading: false,
    data: null,
    error: null,
  };
  
  const profilReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_PROFIL_REQUEST":
            return { ...state, loading: true, error: null };
          case "FETCH_PROFIL_SUCCESS":
            return { loading: false, data: action.payload, error: null };
          case "FETCH_PROFIL_FAILURE":
            return { loading: false, data: null, error: action.payload };
      case "UPDATE_PROFIL_SUCCESS":
        return { ...state, data: action.payload, error: null };
      case "UPDATE_PROFIL_ERROR":
        return { ...state, error: action.payload };
      default:
        return state;
    }
  };
  
  export default profilReducer;
  