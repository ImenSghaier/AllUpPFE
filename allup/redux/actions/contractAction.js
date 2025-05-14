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
  import ContratService from "../../services/ContratService";
  
  export const getReceivedContractsAction = (id_fournisseur) => async (dispatch) => {
    try {
      dispatch({ type: GET_RECEIVED_CONTRACTS_REQUEST });
      const contracts = await ContratService.getReceivedContracts(id_fournisseur);
      dispatch({ type: GET_RECEIVED_CONTRACTS_SUCCESS, payload: contracts });
    } catch (error) {
      dispatch({
        type: GET_RECEIVED_CONTRACTS_FAIL,
        payload: error.message,
      });
    }
  };
  
  export const validateContractAction = (contractId, statut) => async (dispatch) => {
    try {
      dispatch({ type: VALIDATE_CONTRACT_REQUEST });
      const updatedContract = await ContratService.validateContract(contractId, statut);
      dispatch({ type: VALIDATE_CONTRACT_SUCCESS, payload: updatedContract });
    } catch (error) {
      dispatch({
        type: VALIDATE_CONTRACT_FAIL,
        payload: error.message,
      });
    }
  };
  
  export const signContractAction = (contractId) => async (dispatch) => {
    try {
      dispatch({ type: SIGN_CONTRACT_REQUEST });
      const signedContract = await ContratService.signContract(contractId);
      dispatch({ type: SIGN_CONTRACT_SUCCESS, payload: signedContract });
    } catch (error) {
      dispatch({
        type: SIGN_CONTRACT_FAIL,
        payload: error.message,
      });
    }
  };