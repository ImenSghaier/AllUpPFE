import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:4000/user";

const login = async (email, mot_de_passe) => {
  const response = await axios.post(`${API_URL}/login`, { email, mot_de_passe });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    const decodedToken = jwtDecode(response.data.token);
    return { token: response.data.token, role: decodedToken.role };
  }
};

const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data; // { message: "...", etc. }
};

const logout = () => {
  localStorage.removeItem("token");
};

const authService = { login, logout, forgotPassword };
export default authService;

