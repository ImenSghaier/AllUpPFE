import { refreshToken } from "../context/functions"; // axios avec interceptors

// Récupérer les informations du profil
export const getProfilEmploye = async (token) => {
  let http = await refreshToken();

  const res = await http.get("/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// Mettre à jour le profil (nom et téléphone)
export const updateProfilEmploye = async (token, data) => {
  let http = await refreshToken();

  const res = await http.put("/user/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
