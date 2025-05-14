// redux/reducers/offreReducer.js

const initialState = {
  loading: false,
  offres: [],
  error: null,
};

export const offreEmployeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "OFFRE_EMPLOYE_REQUEST":
      return { ...state, loading: true, error: null };

    case "OFFRE_EMPLOYE_SUCCESS":
      return { ...state, loading: false, offres: action.payload };

    case "OFFRE_EMPLOYE_FAIL":
      return { ...state, loading: false, error: action.payload };
      case "OFFRE_EMPLOYE_INACTIVE_REQUEST":
        return { ...state, loading: true, error: null };
  
      case "OFFRE_EMPLOYE_INACTIVE_SUCCESS":
        return { ...state, loading: false, offres: action.payload };
  
      case "OFFRE_EMPLOYE_INACTIVE_FAIL":
        return { ...state, loading: false, error: action.payload };
  
    default:
      return state;
  }
};
