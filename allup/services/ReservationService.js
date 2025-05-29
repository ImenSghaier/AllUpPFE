// ✅ ReservationService.js
import { refreshToken } from "../context/functions";

export const createReservation = async (reservationData) => {
  const http = await refreshToken();
  try {
    const response = await http.post("/reservation/nvReservation", reservationData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la réservation", error);
    throw error;
  }
};

export const getReservationsByEmploye = async (id_employe) => {
  const http = await refreshToken();
  try {
    const response = await http.get(`/reservation/employe/${id_employe}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations", error);
    throw error;
  }
};
export const confirmReservation = async (reservationId) => {
  const http = await refreshToken();
  try {
    const response = await http.put(`/reservation/confirmer/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la confirmation de la réservation", error);
    throw error;
  }
};

export const getReservationsByOffre = async (id_offre) => {
  const http = await refreshToken();
  try {
    const response = await http.get(`/reservation/offre/${id_offre}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations par offre", error);
    throw error;
  }
};

export const getReservationsConfirmeesByEmploye = async (id_employe) => {
  const http = await refreshToken();
  try {
    const response = await http.get(`/reservation/employe/${id_employe}/confirmees`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations confirmées", error);
    throw error;
  }
};