import axios from 'axios';

const API_URL = 'http://localhost:4000/entreprise';

export const addEntreprise = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/add`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Une erreur est survenue lors de l\'ajout de l\'entreprise');
  }
};

export const updateEntreprise = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Une erreur est survenue lors de la mise à jour de l\'entreprise');
  }
};

export const deleteEntreprise = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Une erreur est survenue lors de la suppression de l\'entreprise');
  }
};

export const fetchEntreprises = async (page, limit, search, sort) => {
  try {
    const response = await axios.get(`${API_URL}/all`, { params: { page, limit, search, sort } });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Une erreur est survenue lors de la récupération des entreprises');
  }
};
// services/EntrepriseService.js

// Nouvelle fonction pour récupérer les noms et IDs des entreprises
export const fetchEntrepriseNames = async () => {
  try {
    const response = await axios.get('http://localhost:4000/entreprise/names');
    return response.data;  // Renvoie uniquement les noms et IDs
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Une erreur est survenue lors de la récupération des entreprises');
  }
};
