import { refreshToken } from "../context/functions"; // Ton axios avec interceptors

// Créer une demande
export const createDemande = async (token, demandeData) => {
  let http = await refreshToken();

  const res = await http.post("/demande/create", demandeData, {
    headers: {
      Authorization: `Bearer ${token}`,
   
    },
  });

  return res.data;
};

// Obtenir les demandes envoyées par un employé
export const getDemandesEmploye = async (token) => {
  let http = await refreshToken();

  const res = await http.get("/demande/envoyees", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
