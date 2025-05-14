// ✅ reservationAction.js
import * as reservationService from '../../services/ReservationService';

export const createReservationAction = (reservationData) => async (dispatch) => {
  try {
    const newReservation = await reservationService.createReservation(reservationData);
    dispatch({
      type: 'CREATE_RESERVATION_SUCCESS',
      payload: newReservation
    });
    return { success: true };
  } catch (error) {
    dispatch({
      type: 'CREATE_RESERVATION_FAIL',
      payload: error.message
    });
    return { success: false, error: error.message };
  }
};

export const getReservationsByEmployeAction = (id_employe) => async (dispatch) => {
  try {
    const reservations = await reservationService.getReservationsByEmploye(id_employe);
    dispatch({
      type: 'GET_RESERVATIONS_BY_EMPLOYE_SUCCESS',
      payload: reservations
    });
  } catch (error) {
    dispatch({
      type: 'GET_RESERVATIONS_BY_EMPLOYE_FAIL',
      payload: error.message
    });
  }
};

export const confirmReservationAction = (reservationId) => async (dispatch) => {
  try {
    const confirmedReservation = await reservationService.confirmReservation(reservationId);
    dispatch({
      type: 'CONFIRM_RESERVATION_SUCCESS',
      payload: confirmedReservation
    });
    return { success: true };
  } catch (error) {
    dispatch({
      type: 'CONFIRM_RESERVATION_FAIL',
      payload: error.message
    });
    return { success: false, error: error.message };
  }
};

export const getReservationsByOffreAction = (id_offre) => async (dispatch) => {
  try {
    const reservations = await reservationService.getReservationsByOffre(id_offre);
    dispatch({
      type: 'GET_RESERVATIONS_BY_OFFRE_SUCCESS',
      payload: reservations
    });
  } catch (error) {
    dispatch({
      type: 'GET_RESERVATIONS_BY_OFFRE_FAIL',
      payload: error.message
    });
  }
};