import axios from "axios";

const API_URL = "http://localhost:4000/demande"; // à adapter

const getToken = () => localStorage.getItem("token");

export const getDemandesAdmin = async () => {
  const response = await axios.get(`${API_URL}/recues`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const changerStatutDemande = async (id, statut) => {
  const response = await axios.put(
    `${API_URL}/${id}/statut`,
    { statut },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
