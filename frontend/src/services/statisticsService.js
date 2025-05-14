import axios from 'axios';

const API_URL = 'http://localhost:4000/api/admin/statistics';

const getStatistics = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

export default { getStatistics };
