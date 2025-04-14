import { FETCH_ENTREPRISES, ADD_ENTREPRISE, UPDATE_ENTREPRISE, DELETE_ENTREPRISE } from '../types';
import * as entrepriseService from '../../services/entrepriseService';
import axios from 'axios'
// Action pour récupérer les entreprises
export const fetchEntreprises = (page, limit, search, sort) => async (dispatch) => {
  try {
    const data = await entrepriseService.fetchEntreprises(page, limit, search, sort);
    dispatch({
      type: FETCH_ENTREPRISES,
      payload: data,
    });
  } catch (error) {
    console.error(error);
  }
};

// Action pour ajouter une entreprise
export const addEntreprise = (data) => async (dispatch) => {
  try {
    const entreprise = await entrepriseService.addEntreprise(data);
    dispatch({
      type: ADD_ENTREPRISE,
      payload: entreprise,
    });
  } catch (error) {
    console.error(error);
  }
};

// Action pour mettre à jour une entreprise
export const updateEntreprise = (id, data) => async (dispatch) => {
  try {
    const entreprise = await entrepriseService.updateEntreprise(id, data);
    dispatch({
      type: UPDATE_ENTREPRISE,
      payload: entreprise,
    });
  } catch (error) {
    console.error(error);
  }
};

// Action pour supprimer une entreprise
export const deleteEntreprise = (id) => async (dispatch) => {
  try {
    await entrepriseService.deleteEntreprise(id);
    dispatch({
      type: DELETE_ENTREPRISE,
      payload: id,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getEntreprisesAction = () => async (dispatch) => {
    try {
      const { data } = await axios.get('http://localhost:4000/entreprise/all');
      dispatch({ type: 'GET_ENTREPRISES_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'GET_ENTREPRISES_FAIL', payload: error.message });
    }
  };