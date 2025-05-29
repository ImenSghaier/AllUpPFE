const initialState = {
  reservation: null,
  reservations: [],
  confirmedReservations: [], 
  reservationsByOffre: [],
  error: null,
};

const reservationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_RESERVATION_SUCCESS':
      return {
        ...state,
        reservation: action.payload,
        error: null,
      };
    case 'CREATE_RESERVATION_FAIL':
      return {
        ...state,
        error: action.payload,
      };
    case 'GET_RESERVATIONS_BY_EMPLOYE_SUCCESS':
      return {
        ...state,
        reservations: action.payload,
        error: null,
      };
    case 'GET_RESERVATIONS_BY_EMPLOYE_FAIL':
      return {
        ...state,
        error: action.payload,
      };
      case 'CONFIRM_RESERVATION_SUCCESS':
        return {
          ...state,
          reservation: action.payload,
          error: null,
        };
      case 'CONFIRM_RESERVATION_FAIL':
        return {
          ...state,
          error: action.payload,
        };
      case 'GET_RESERVATIONS_BY_OFFRE_SUCCESS':
        return {
          ...state,
          reservationsByOffre: action.payload,
          error: null,
        };
      case 'GET_RESERVATIONS_BY_OFFRE_FAIL':
        return {
          ...state,
          error: action.payload,
        };
        case 'GET_CONFIRMED_RESERVATIONS_BY_EMPLOYE_SUCCESS':
          return {
            ...state,
            confirmedReservations: action.payload,
            error: null,
          };
        case 'GET_CONFIRMED_RESERVATIONS_BY_EMPLOYE_FAIL':
          return {
            ...state,
            error: action.payload,
          };
          
      default:
        return state;
    }
};

export default reservationReducer;
