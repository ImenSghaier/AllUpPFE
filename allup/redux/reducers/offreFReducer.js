import {
    OFFRE_LOADING,
    OFFRE_ERROR,
    GET_OFFRES_SUCCESS,
    GET_OFFRE_SUCCESS,
    ADD_OFFRE_SUCCESS,
    UPDATE_OFFRE_SUCCESS,
    DELETE_OFFRE_SUCCESS
  } from "../actions/offreFAction";
  
  const initialState = {
    loading: false,
    error: null,
    offres: [],
    currentOffre: null,
    pagination: {
      totalOffres: 0,
      totalPages: 1,
      currentPage: 1
    }
  };
  
  const offreFReducer = (state = initialState, action) => {
    switch (action.type) {
      case OFFRE_LOADING:
        return { ...state, loading: true, error: null };
  
      case OFFRE_ERROR:
        return { ...state, loading: false, error: action.payload };
  
      case GET_OFFRES_SUCCESS:
        return {
          ...state,
          loading: false,
          offres: action.payload.offres || action.payload,
          pagination: action.payload.totalOffres ? {
            totalOffres: action.payload.totalOffres,
            totalPages: action.payload.totalPages,
            currentPage: action.payload.currentPage
          } : state.pagination
        };
  
      case GET_OFFRE_SUCCESS:
        return {
          ...state,
          loading: false,
          currentOffre: action.payload
        };
  
      case ADD_OFFRE_SUCCESS:
        return {
          ...state,
          loading: false,
          offres: [action.payload, ...state.offres],
          currentOffre: action.payload
        };
  
      case UPDATE_OFFRE_SUCCESS:
        return {
          ...state,
          loading: false,
          offres: state.offres.map(offre =>
            offre._id === action.payload.id ? action.payload.data : offre
          ),
          currentOffre: action.payload.data
        };
  
      case DELETE_OFFRE_SUCCESS:
        return {
          ...state,
          loading: false,
          offres: state.offres.filter(offre => offre._id !== action.payload),
          currentOffre: null
        };
  
      default:
        return state;
    }
  };
  
  export default offreFReducer;