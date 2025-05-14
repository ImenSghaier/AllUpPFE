import {
  FETCH_DEMANDES_REQUEST,
  FETCH_DEMANDES_SUCCESS,
  FETCH_DEMANDES_FAILURE,
  UPDATE_DEMANDE_STATUT,
} from "../actions/demandeAction";

const initialState = {
  loading: false,
  demandes: [],
  error: null,
};

const demandeReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DEMANDES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_DEMANDES_SUCCESS:
      return { ...state, loading: false, demandes: action.payload };
    case FETCH_DEMANDES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_DEMANDE_STATUT:
      return {
        ...state,
        demandes: state.demandes.map((d) =>
          d._id === action.payload._id ? action.payload : d
        ),
      };
    default:
      return state;
  }
};

export default demandeReducer;
