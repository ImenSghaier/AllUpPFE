import {
    GET_RECEIVED_CONTRACTS_REQUEST,
    GET_RECEIVED_CONTRACTS_SUCCESS,
    GET_RECEIVED_CONTRACTS_FAIL,
    VALIDATE_CONTRACT_REQUEST,
    VALIDATE_CONTRACT_SUCCESS,
    VALIDATE_CONTRACT_FAIL,
    SIGN_CONTRACT_REQUEST,
    SIGN_CONTRACT_SUCCESS,
    SIGN_CONTRACT_FAIL,
  } from "../types";
  
  const initialState = {
    receivedContracts: [],
    loading: false,
    error: null,
  };
  
  export const contractReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_RECEIVED_CONTRACTS_REQUEST:
      case VALIDATE_CONTRACT_REQUEST:
      case SIGN_CONTRACT_REQUEST:
        return { ...state, loading: true, error: null };
  
      case GET_RECEIVED_CONTRACTS_SUCCESS:
        return { ...state, loading: false, receivedContracts: action.payload };
  
      case VALIDATE_CONTRACT_SUCCESS:
        return {
          ...state,
          loading: false,
          receivedContracts: state.receivedContracts.map((contract) =>
            contract._id === action.payload._id ? action.payload : contract
          ),
        };
  
      case SIGN_CONTRACT_SUCCESS:
        return {
          ...state,
          loading: false,
          receivedContracts: state.receivedContracts.map((contract) =>
            contract._id === action.payload._id ? action.payload : contract
          ),
        };
  
      case GET_RECEIVED_CONTRACTS_FAIL:
      case VALIDATE_CONTRACT_FAIL:
      case SIGN_CONTRACT_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };