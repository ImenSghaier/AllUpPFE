import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchStats = async () => {
  try {
    const [summary, users, offers, contracts] = await Promise.all([
      api.get('/stats/summary'),
      api.get('/stats/users'),
      api.get('/stats/offers'),
      api.get('/stats/contracts')
    ]);
    // Dans fetchStats
    console.log('API Responses:', {
    summary: summary.data,
    users: users.data,
    offers: offers.data,
    contracts: contracts.data
  });
    return {
      summary: summary.data,
      users: users.data,
      offers: offers.data,
      contracts: contracts.data
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    
    // Retourner des données par défaut en cas d'erreur
    return {
      summary: { users: 0, offers: 0, conventions: 0 },
      users: { recentUsers: [], activeUsers: 0, newUsers: 0 },
      offers: { recentOffers: [], activeOffers: 0, popularOffers: [] },
      contracts: { recentContracts: [], activeContracts: 0, expiringSoon: [] }
    };
  }
};

export default api;