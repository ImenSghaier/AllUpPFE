import { FETCH_ENTREPRISES, ADD_ENTREPRISE, UPDATE_ENTREPRISE, DELETE_ENTREPRISE } from '../types';

const initialState = {
  entreprises: [],
  total: 0,
  page: 1,
  pages: 1,
};

export const entrepriseReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ENTREPRISES:
      return {
        ...state,
        entreprises: action.payload.entreprises,
        total: action.payload.total,
        page: action.payload.page,
        pages: action.payload.pages,
      };
    case ADD_ENTREPRISE:
      return {
        ...state,
        entreprises: [...state.entreprises, action.payload],
      };
    case UPDATE_ENTREPRISE:
      return {
        ...state,
        entreprises: state.entreprises.map((entreprise) =>
          entreprise._id === action.payload._id ? action.payload : entreprise
        ),
      };
    case DELETE_ENTREPRISE:
      return {
        ...state,
        entreprises: state.entreprises.filter((entreprise) => entreprise._id !== action.payload),
      };
    default:
      return state;
  }
};
