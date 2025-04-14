import { GET_OFFRES, ADD_OFFRE, DELETE_OFFRE, UPDATE_OFFRE, SET_LOADING } from '../types';

const initialState = {
  offres: [],
  totalOffres: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
};

const offreReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_OFFRES:
      return {
        ...state,
        offres: action.payload.offres,
        totalOffres: action.payload.totalOffres,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.currentPage,
      };
    case ADD_OFFRE:
      return {
        ...state,
        offres: [action.payload, ...state.offres],
      };
    case DELETE_OFFRE:
      return {
        ...state,
        offres: state.offres.filter(offre => offre._id !== action.payload),
      };
      case UPDATE_OFFRE:
            return {
                ...state,
                offres: state.offres.map((offre) =>
                    offre._id === action.payload._id ? action.payload : offre
                ),  // Mise à jour de l'offre modifiée dans la liste
            };
      
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export default offreReducer;  // Assure-toi d'utiliser export default
