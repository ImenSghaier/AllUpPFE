import { GET_OFFRES, ADD_OFFRE, DELETE_OFFRE, UPDATE_OFFRE, SET_LOADING } from '../types';
import { getOffresPaginated, getOffres, addOffre, updateOffre, deleteOffre } from '../../services/offreService';
export const fetchOffres = (page, limit, sortBy, sortOrder, filters) => async (dispatch) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
        const data = await getOffres(page, limit, sortBy, sortOrder, filters);
        dispatch({
            type: GET_OFFRES,
            payload: data,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des offres", error);
    } finally {
        dispatch({ type: SET_LOADING, payload: false });
    }
};
// Action pour récupérer les offres paginées
export const fetchOffresPaginated = (page, limit, sortBy, sortOrder, filters) => async (dispatch) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
        const data = await getOffresPaginated(page, limit, sortBy, sortOrder, filters);
        dispatch({
            type: GET_OFFRES,
            payload: data,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des offres paginées", error);
    } finally {
        dispatch({ type: SET_LOADING, payload: false });
    }
};
export const createOffre = (offreData) => async (dispatch) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
        const newOffre = await addOffre(offreData);
        dispatch({
            type: ADD_OFFRE,
            payload: newOffre,
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'offre", error);
    } finally {
        dispatch({ type: SET_LOADING, payload: false });
    }
};

export const editOffre = (id, offreData) => async (dispatch) => {
    dispatch({ type: SET_LOADING, payload: true });  // Début du chargement
    try {
        // Mise à jour de l'offre via le service
        const updatedOffre = await updateOffre(id, offreData);

        // Dispatch de l'action pour mettre à jour l'état avec l'offre modifiée
        dispatch({
            type: UPDATE_OFFRE,
            payload: updatedOffre,
        });

        // Affichage du succès dans la console
        console.log("Offre mise à jour avec succès : ", updatedOffre);
    } catch (error) {
        // Gestion des erreurs en cas de problème avec l'API
        console.error("Erreur lors de la modification de l'offre", error);
    } finally {
        // Terminer le chargement une fois la requête terminée
        dispatch({ type: SET_LOADING, payload: false });
    }
};


// export const editOffre = (id, offreData) => async (dispatch) => {
//     dispatch({ type: SET_LOADING, payload: true });  // Début du chargement
//     try {
//         // Mise à jour de l'offre via le service
//         const updatedOffre = await updateOffre(id, offreData);

//         // Dispatch de l'action pour mettre à jour l'état avec l'offre modifiée
//         dispatch({
//             type: UPDATE_OFFRE,
//             payload: updatedOffre,
//         });

//         // Optionnel: Afficher un message de succès ou autres actions
//         console.log("Offre mise à jour avec succès : ", updatedOffre);

//     } catch (error) {
//         // Gestion des erreurs en cas de problème avec l'API
//         console.error("Erreur lors de la modification de l'offre", error);
//     } finally {
//         // Terminer le chargement une fois la requête terminée
//         dispatch({ type: SET_LOADING, payload: false });
//     }
// };
export const removeOffre = (id) => async (dispatch) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
        await deleteOffre(id);
        dispatch({
            type: DELETE_OFFRE,
            payload: id,
        });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'offre", error);
    } finally {
        dispatch({ type: SET_LOADING, payload: false });
    }
};
