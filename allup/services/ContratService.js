import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshToken } from "../context/functions";

const getReceivedContracts = async (id_fournisseur) => {
  try {
    const http = await refreshToken();
    const response = await http.get(`/contract/received/${id_fournisseur}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors de la récupération des contrats";
  }
};

const validateContract = async (contractId, statut) => {
  try {
    const http = await refreshToken();
    const response = await http.put(`/contract/validate/${contractId}`, { statut });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors de la validation du contrat";
  }
};

const signContract = async (contractId) => {
  try {
    const http = await refreshToken();
    const response = await http.put(`/contract/sign/${contractId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors de la signature du contrat";
  }
};

export default {
  getReceivedContracts,
  validateContract,
  signContract,
};