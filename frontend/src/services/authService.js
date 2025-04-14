import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:4000/user/login";

const login = async (email, mot_de_passe) => {
  try {
    const response = await axios.post(API_URL, { email, mot_de_passe });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      const decodedToken = jwtDecode(response.data.token);
      return { token: response.data.token, role: decodedToken.role };
    }
  } catch (error) {
    console.error("Erreur de connexion :", error.response?.data || error.message);
    throw error;
  }
};

// Fonction de déconnexion
const logout = () => {
  localStorage.removeItem("token");
  // Si tu as aussi un état global (par exemple Redux), tu pourrais dispatcher une action pour réinitialiser l'état utilisateur.
};

const authService = { login, logout };
export default authService;



// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// const API_URL = "http://localhost:4000/user/login";
// const login = async (email,mot_de_passe)=>{
//     try{
//     const response =await axios.post(API_URL,{email,mot_de_passe});
//     if(response.data.token){
//         localStorage.setItem("token",response.data.token);
//         //decoder le token pour recuperer le role
//         const decodedToken =jwtDecode(response.data.token);
//         // localStorage.setItem("role",decodedToken.role);
//         return {token: response.data.token, role: decodedToken.role};
//     }
// }catch(error){
//     console.error("Erreur de connexion :", error.response?.data || error.message);
//     throw error;
// }

  
// };
// const authService = {login};
// export default authService;