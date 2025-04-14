import {
  CREATE_CONTRACT,
  GET_SENT_CONTRACTS,
  GET_RECEIVED_CONTRACTS,
  VALIDATE_CONTRACT,
  SIGN_CONTRACT,
} from "../types";

const initialState = {
  contracts:[],
  sentContracts: [], // Contrats envoyés par l'AdminEntreprise
  receivedContracts: [], // Contrats reçus par le Fournisseur
  loading: false,
  error: null,
};

const contractReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CONTRACT:
      return {
        ...state,
        sentContracts: [...state.sentContracts, action.payload],
      };

    case GET_SENT_CONTRACTS:
      return {
        ...state,
        sentContracts: action.payload,
      };

    case GET_RECEIVED_CONTRACTS:
      return {
        ...state,
        receivedContracts: action.payload,
      };
      
    case VALIDATE_CONTRACT:
      return {
        ...state,
        receivedContracts: state.receivedContracts.map((contract) =>
          contract._id === action.payload._id ? action.payload : contract
        ),
      };

    case SIGN_CONTRACT:
      return {
        ...state,
        receivedContracts: state.receivedContracts.map((contract) =>
          contract._id === action.payload._id ? action.payload : contract
        ),
      };

    default:
      return state;
  }
};

export default contractReducer;



// import {
//     CREATE_CONTRACT,
//     GET_SENT_CONTRACTS,
//     GET_RECEIVED_CONTRACTS,
//     VALIDATE_CONTRACT,
//     SIGN_CONTRACT,
//   } from "../types";
  
//   const initialState = {
//     sentContracts: [],
//     receivedContracts: [],
//   };
  
//   const contractReducer = (state = initialState, action) => {
//     switch (action.type) {
//       case CREATE_CONTRACT:
//         return {
//           ...state,
//           sentContracts: [...state.sentContracts, action.payload.contract],
//         };
  
//       case GET_SENT_CONTRACTS:
//         return {
//           ...state,
//           sentContracts: action.payload,
//         };
  
//       case GET_RECEIVED_CONTRACTS:
//         return {
//           ...state,
//           receivedContracts: action.payload,
//         };
  
//       case VALIDATE_CONTRACT:
//         return {
//           ...state,
//           receivedContracts: state.receivedContracts.map((contract) =>
//             contract._id === action.payload.contract._id ? action.payload.contract : contract
//           ),
//         };
  
//       case SIGN_CONTRACT:
//         return {
//           ...state,
//           receivedContracts: state.receivedContracts.map((contract) =>
//             contract._id === action.payload.contract._id ? action.payload.contract : contract
//           ),
//         };
  
//       default:
//         return state;
//     }
//   };
  
//   export default contractReducer;
  