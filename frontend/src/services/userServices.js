// Ce fichier sert à centraliser les appels API liés aux utilisateurs, ce qui rend le code plus organisé et réutilisable.
import axios from 'axios';

const API_URL = 'http://localhost:4000/user';  // Mettez l'URL correcte

// Récupérer tous les utilisateurs
export const getUsers = async (page = 1, search = '', role = '', sortBy = 'nom') => { //page → permet la pagination search → filtre par recherche (nom, email…) role → filtre par rôle (Admin, Employé, etc.) sortBy → permet de trier les résultats (exemple : par nom)
    const token = localStorage.getItem('token');
    const headers = { //Ajoute le token dans les headers pour sécuriser l'accès
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axios.get(`${API_URL}/users?page=${page}&search=${search}&role=${role}&sortBy=${sortBy}`, { headers });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Créer un nouvel utilisateur
export const createUser = async (userData) => {
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axios.post(`${API_URL}/create-user`, userData, { headers });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Mettre à jour un utilisateur
export const updateUser = async (id, userData) => {
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axios.put(`${API_URL}/update-user/${id}`, userData, { headers });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Supprimer un utilisateur
export const deleteUser = async (id) => {
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axios.delete(`${API_URL}/delete/${id}`, { headers });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Pourquoi utiliser un service ?
// ✅ Séparation des responsabilités : Ce fichier gère uniquement les requêtes API, ce qui évite d'écrire ces appels directement dans les composants React.
// ✅ Réutilisation : On peut utiliser ces fonctions dans plusieurs composants.
// ✅ Facilité de maintenance : Si l’URL du backend change, on modifie juste API_URL.

