import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshToken } from "../context/functions";

// Fonction pour récupérer le token avec vérification d'expiration
const getValidToken = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) return null;
  return token;
};

// Service pour les opérations sur les offres
const serviceFOffre = {
  // Ajouter une offre
  addOffre: async (offreData, imageUri) => {
    try {
      const token = await getValidToken();
      if (!token) throw new Error("Non authentifié");

      const formData = new FormData();
      formData.append("titre", offreData.titre);
      formData.append("description", offreData.description);
      formData.append("prix", offreData.prix);
      formData.append("type", offreData.type);
      formData.append("date_debut", offreData.date_debut);
      formData.append("date_fin", offreData.date_fin);
      formData.append("categorie", offreData.categorie);
      formData.append("pourcentage_reduction", offreData.pourcentage_reduction || 0);
      
      if (imageUri) {
        formData.append("image", {
          uri: imageUri,
          type: "image/jpeg",
          name: `offre_${Date.now()}.jpg`
        });
      }

      const http = await refreshToken();
      const response = await http.post("/offre/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer toutes les offres (pour le fournisseur connecté)
  getOffres: async (queryParams = {}) => {
    try {
      const token = await getValidToken();
      if (!token) throw new Error("Non authentifié");

      const http = await refreshToken();
      const response = await http.get("/offre/all", {
        params: queryParams,
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer les offres paginées (pour tous les utilisateurs)
  getOffresPaginated: async (queryParams = {}) => {
    try {
      const http = await refreshToken();
      const response = await http.get("/offre/all-paginated", {
        params: queryParams
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer une offre par ID
  getOffreById: async (id) => {
    try {
      const http = await refreshToken();
      const response = await http.get(`/offre/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour une offre
  updateOffre: async (id, updatedData) => {
    try {
      const token = await getValidToken();
      if (!token) throw new Error("Non authentifié");

      const http = await refreshToken();
      const response = await http.put(`/offre/update/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Supprimer une offre
  deleteOffre: async (id) => {
    try {
      const token = await getValidToken();
      if (!token) throw new Error("Non authentifié");

      const http = await refreshToken();
      const response = await http.delete(`/offre/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default serviceFOffre;