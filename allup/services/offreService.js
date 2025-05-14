// services/offreService.js
import { refreshToken } from "../context/functions"; // ton axios avec interceptors

export const getOffresActivesEmploye = async (token) => {
  let http = await refreshToken();

  const res = await http.get("/contract/offres-actives-employe", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
export const getOffresInactivesEmploye = async (token) => {
  let http = await refreshToken();

  const res = await http.get("/contract/offres-non-actives-employe", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
