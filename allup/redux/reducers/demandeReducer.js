const initialState = {
    demandesEnvoyees: [],
    loading: false,
    error: null,
  };
  
  const demandeReducer = (state = initialState, action) => {
    switch (action.type) {
      case "CREATE_DEMANDE_SUCCESS":
        return {
          ...state,
          demandesEnvoyees: [...state.demandesEnvoyees, action.payload],
          loading: false,
          error: null,
        };
  
      case "CREATE_DEMANDE_FAILURE":
        return {
          ...state,
          loading: false,
          error: action.error,
        };
  
      case "GET_DEMANDES_EMPLOYE_SUCCESS":
        return {
          ...state,
          demandesEnvoyees: action.payload,
          loading: false,
          error: null,
        };
  
      case "GET_DEMANDES_EMPLOYE_FAILURE":
        return {
          ...state,
          loading: false,
          error: action.error,
        };
  
      default:
        return state;
    }
  };
  
  export default demandeReducer;
  