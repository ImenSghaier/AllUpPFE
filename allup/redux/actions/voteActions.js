// redux/actions/voteActions.js
import {
  createVote,
  getVotesForOffer
} from '../../services/voteService';

export const CREATE_VOTE_REQUEST = 'CREATE_VOTE_REQUEST';
export const CREATE_VOTE_SUCCESS = 'CREATE_VOTE_SUCCESS';
export const CREATE_VOTE_FAILURE = 'CREATE_VOTE_FAILURE';

export const FETCH_VOTES_REQUEST = 'FETCH_VOTES_REQUEST';
export const FETCH_VOTES_SUCCESS = 'FETCH_VOTES_SUCCESS';
export const FETCH_VOTES_FAILURE = 'FETCH_VOTES_FAILURE';

export const createVoteAction = (offreId, isPositive, commentaire) => async (dispatch) => {
  dispatch({ type: CREATE_VOTE_REQUEST });
  try {
    const data = await createVote(offreId, isPositive, commentaire);
    dispatch({ 
      type: CREATE_VOTE_SUCCESS, 
      payload: data,
      offreId // Ajoutez l'offreId pour mettre à jour le store
    });
    return data;
  } catch (error) {
    dispatch({ 
      type: CREATE_VOTE_FAILURE, 
      payload: error.response?.data?.message || error.message 
    });
    throw error;
  }
};

// Assurez-vous que vous exportez bien fetchVotesAction
export const fetchVotesAction = (offreId) => async (dispatch) => {
  dispatch({ type: FETCH_VOTES_REQUEST });
  try {
    const res = await getVotesForOffer(offreId);
    
    // Formatage des données pour le reducer
    const payload = {
      data: {
        votes: res.data.votes || [],
        statistics: res.data.statistics || null,
        userVote: res.data.userVote || null
      }
    };
    
    dispatch({ type: FETCH_VOTES_SUCCESS, payload });
    return payload;
  } catch (error) {
    dispatch({ type: FETCH_VOTES_FAILURE, payload: error.message });
    throw error;
  }
};