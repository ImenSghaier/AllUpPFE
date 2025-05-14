import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshToken } from "../context/functions";

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erreur lors du décodage du token :", error);
    return null;
  }
};

const login = async (email, mot_de_passe) => {
  let http = await refreshToken();
  const response = await http.post(`/user/login`, { email, mot_de_passe });
  if (response.data.token) {
    await AsyncStorage.setItem("token", response.data.token);
    const decoded = decodeToken(response.data.token);
    return { token: response.data.token, role: decoded?.role };
  }
};

const logout = async () => {
  await AsyncStorage.removeItem("token");
};

const forgotPassword = async (email) => {
  try {
    const http = await refreshToken();
    const response = await http.post('/user/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error("Forgot password error:", error.response?.data?.message || error.message);
    throw error.response?.data?.message || "Erreur lors de la demande de réinitialisation";
  }
};

export default {
  login,
  logout,
  forgotPassword
};

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { refreshToken } from "../context/functions";

// // Fonction pour décoder un token JWT sans bibliothèque externe
// const decodeToken = (token) => {
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split('')
//         .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//         .join('')
//     );
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     console.error("Erreur lors du décodage du token :", error);
//     return null;
//   }
// };



// const login = async (email, mot_de_passe) => {
//   let http = await refreshToken();
//   const response = await http.post(`/user/login`, { email, mot_de_passe });
//   if (response.data.token) {
//     await AsyncStorage.setItem("token", response.data.token);
//     const decoded = decodeToken(response.data.token);
//     return { token: response.data.token, role: decoded?.role };
//   }
// };

// const logout = async () => {
//   await AsyncStorage.removeItem("token");
// };



// export default {
//   login,
//   logout,
 
// };

