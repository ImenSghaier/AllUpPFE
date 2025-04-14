import {
  CREATE_CONTRACT,
  GET_SENT_CONTRACTS,
  GET_RECEIVED_CONTRACTS,
  VALIDATE_CONTRACT,
  SIGN_CONTRACT,
} from "../types";
import {
  createContract,
  getSentContracts,
  getReceivedContracts,
  validateContract,
  signContract,
} from "../../services/contractService";

// 🟢 Action pour créer un contrat (AdminEntreprise)
export const createContractAction = (contractData) => async (dispatch) => {
  try {
      const data = await createContract(contractData);
      dispatch({ type: CREATE_CONTRACT, payload: data });
  } catch (error) {
      console.error("Erreur lors de la création du contrat:", error);
  }
};

// 🟢 Récupérer les contrats envoyés (AdminEntreprise)
export const getSentContractsAction = (id_entreprise) => async (dispatch) => {
  try {
      const data = await getSentContracts(id_entreprise);
      dispatch({ type: GET_SENT_CONTRACTS, payload: data });
  } catch (error) {
      console.error("Erreur lors de la récupération des contrats envoyés:", error);
  }
};

// 🔵 Récupérer les contrats reçus (Fournisseur)
export const getReceivedContractsAction = (id_fournisseur) => async (dispatch) => {
  try {
      const data = await getReceivedContracts(id_fournisseur);
      dispatch({ type: GET_RECEIVED_CONTRACTS, payload: data });
  } catch (error) {
      console.error("Erreur lors de la récupération des contrats reçus:", error);
  }
};

// 🔵 Valider ou refuser un contrat (Fournisseur)
export const validateContractAction = (contractId, statut) => async (dispatch) => {
  try {
      const data = await validateContract(contractId, statut);
      dispatch({ type: VALIDATE_CONTRACT, payload: data });
  } catch (error) {
      console.error("Erreur lors de la validation du contrat:", error);
  }
};

// 🔵 Signer un contrat (Fournisseur)
export const signContractAction = (contractId) => async (dispatch) => {
  try {
      const data = await signContract(contractId);
      dispatch({ type: SIGN_CONTRACT, payload: data });
  } catch (error) {
      console.error("Erreur lors de la signature du contrat:", error);
  }
};



// import {
//     CREATE_CONTRACT,
//     GET_SENT_CONTRACTS,
//     GET_RECEIVED_CONTRACTS,
//     VALIDATE_CONTRACT,
//     SIGN_CONTRACT,
//   } from "../types";
//   import {
//     createContract,
//     getSentContracts,
//     getReceivedContracts,
//     validateContract,
//     signContract,
//   } from "../../services/contractService";
  
//   // 🟢 Action pour créer un contrat (AdminEntreprise)
//   export const createContractAction = (contractData) => async (dispatch) => {
//     try {
//       const data = await createContract(contractData);
//       dispatch({ type: CREATE_CONTRACT, payload: data });
//     } catch (error) {
//       console.error("Error creating contract:", error);
//     }
//   };
  
//   // 🟢 Récupérer les contrats envoyés (AdminEntreprise)
//   export const getSentContractsAction = (id_entreprise) => async (dispatch) => {
//     try {
//       const data = await getSentContracts(id_entreprise);
//       dispatch({ type: GET_SENT_CONTRACTS, payload: data });
//     } catch (error) {
//       console.error("Error fetching sent contracts:", error);
//     }
//   };
  
//   // 🔵 Récupérer les contrats reçus (Fournisseur)
//   export const getReceivedContractsAction = (id_fournisseur) => async (dispatch) => {
//     try {
//       const data = await getReceivedContracts(id_fournisseur);
//       dispatch({ type: GET_RECEIVED_CONTRACTS, payload: data });
//     } catch (error) {
//       console.error("Error fetching received contracts:", error);
//     }
//   };
  
//   // 🔵 Valider ou refuser un contrat (Fournisseur)
//   export const validateContractAction = (contractId, statut) => async (dispatch) => {
//     try {
//       const data = await validateContract(contractId, statut);
//       dispatch({ type: VALIDATE_CONTRACT, payload: data });
//     } catch (error) {
//       console.error("Error validating contract:", error);
//     }
//   };
  
//   // 🔵 Signer un contrat (Fournisseur)
//   export const signContractAction = (contractId) => async (dispatch) => {
//     try {
//       const data = await signContract(contractId);
//       dispatch({ type: SIGN_CONTRACT, payload: data });
//     } catch (error) {
//       console.error("Error signing contract:", error);
//     }
//   };
  