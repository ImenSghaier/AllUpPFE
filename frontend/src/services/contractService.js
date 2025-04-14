import axios from "axios";

const API_URL = "http://localhost:4000/contract";

// ✅ Fonction pour récupérer le token depuis le stockage local
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// 🟢 Créer un contrat (AdminEntreprise)
export const createContract = async (contractData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Token JWT manquant.");
    }

    const response = await axios.post(`${API_URL}/create`, contractData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du contrat :", error);
    throw error;
  }
};

// 🟢 Récupérer tous les contrats envoyés (AdminEntreprise)
export const getSentContracts = async (id_entreprise) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Token JWT manquant.");
    }

    const response = await axios.get(`${API_URL}/sent/${id_entreprise}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des contrats envoyés :", error);
    throw error;
  }
};

// 🔵 Récupérer les contrats reçus (Fournisseur)
export const getReceivedContracts = async (id_fournisseur) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Token JWT manquant.");
    }

    const response = await axios.get(`${API_URL}/received/${id_fournisseur}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // S'assurer que la réponse est bien un tableau
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      throw new Error("Les contracts reçus ne sont pas dans un format valide.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des contracts reçus :", error);
    throw error;
  }
};


// 🔵 Valider ou refuser un contrat (Fournisseur)
export const validateContract = async (contractId, statut) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Token JWT manquant.");
    }

    const response = await axios.put(`${API_URL}/validate/${contractId}`, { statut }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la validation du contrat :", error);
    throw error;
  }
};

// 🔵 Signer un contrat (Fournisseur)
export const signContract = async (contractId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Token JWT manquant.");
    }

    const response = await axios.put(`${API_URL}/sign/${contractId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la signature du contrat :", error);
    throw error;
  }
};





// import axios from "axios";

// const API_URL = "http://localhost:4000/contract";

// // 🟢 Créer un contrat (AdminEntreprise)
// export const createContract = async (contractData) => {
//   const response = await axios.post(`${API_URL}/create`, contractData);
//   return response.data;
// };

// // 🟢 Récupérer tous les contrats envoyés (AdminEntreprise)
// export const getSentContracts = async (id_entreprise) => {
//   const response = await axios.get(`${API_URL}/sent/${id_entreprise}`);
//   return response.data;
// };

// // 🔵 Récupérer les contrats reçus (Fournisseur)
// export const getReceivedContracts = async (id_fournisseur) => {
//   const response = await axios.get(`${API_URL}/received/${id_fournisseur}`);
//   return response.data;
// };

// // 🔵 Valider ou refuser un contrat (Fournisseur)
// export const validateContract = async (contractId, statut) => {
//   const response = await axios.put(`${API_URL}/validate/${contractId}`, { statut });
//   return response.data;
// };

// // 🔵 Signer un contrat (Fournisseur)
// export const signContract = async (contractId) => {
//   const response = await axios.put(`${API_URL}/sign/${contractId}`);
//   return response.data;
// };
