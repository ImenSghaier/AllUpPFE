import axios from 'axios';

// URL du backend
const API_URL = 'http://localhost:4000/offre/';

// Fonction pour récupérer l'authentification et décoder le token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Service pour récupérer toutes les offres
export const getOffres = async (page = 1, limit = 10, sortBy = 'titre', sortOrder = 'asc', filters = {}) => {
    try {
        const response = await axios.get(`${API_URL}all`, {
            params: {
                page,
                limit,
                sortBy,
                sortOrder,
                ...filters,
            },
            ...getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Service pour ajouter une nouvelle offre
export const addOffre = async (offreData) => {
    try {
        const formData = new FormData();
        for (const key in offreData) {
            formData.append(key, offreData[key]);
        }

        const response = await axios.post(`${API_URL}add`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...getAuthHeaders().headers,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Service pour mettre à jour une offre
// export const updateOffre = async (id, offreData) => {
//     try {
//         const formData = new FormData();
//         for (const key in offreData) {
//             formData.append(key, offreData[key]);
//         }

//         const response = await axios.put(`${API_URL}update/${id}`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//                 ...getAuthHeaders().headers,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };
export const updateOffre = async (id, offreData) => {
    try {
        const response = await axios.put(`${API_URL}update/${id}`, offreData, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders().headers,  // Ajouter les headers d'authentification si nécessaire
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
// Service pour supprimer une offre
export const deleteOffre = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}delete/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Service pour récupérer toutes les offres paginées
export const getOffresPaginated = async (page = 1, limit = 10, sortBy = 'titre', sortOrder = 'asc', filters = {}) => {
    try {
        const response = await axios.get(`${API_URL}all-paginated`, {
            params: {
                page,
                limit,
                sortBy,
                sortOrder,
                ...filters,
            },
            ...getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

