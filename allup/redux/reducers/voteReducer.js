
import {
  CREATE_VOTE_REQUEST,
  CREATE_VOTE_SUCCESS,
  CREATE_VOTE_FAILURE,
  FETCH_VOTES_REQUEST,
  FETCH_VOTES_SUCCESS,
  FETCH_VOTES_FAILURE
} from '../actions/voteActions';

const initialState = {
  loading: false,
  error: null,
  votes: [], // Tous les votes
  statistics: {}, // Statistiques par offre { [offreId]: stats }
  userVotes: {}   // Votes utilisateur par offre { [offreId]: vote }
};

export const voteReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_VOTE_REQUEST:
    case FETCH_VOTES_REQUEST:
      return { ...state, loading: true, error: null };
    
    case CREATE_VOTE_SUCCESS:
      const newVote = action.payload.data;
      return {
        ...state,
        loading: false,
        votes: [...state.votes, newVote],
        userVotes: {
          ...state.userVotes,
          [newVote.offre]: newVote
        }
      };
      case FETCH_VOTES_SUCCESS:
        const { votes, statistics, userVote } = action.payload.data;
        const offreId = votes[0]?.offre || userVote?.offre;
        
        // Vérifier si les données ont vraiment changé avant de mettre à jour l'état
        const currentStats = state.statistics[offreId];
        const currentUserVote = state.userVotes[offreId];
        
        if (JSON.stringify(currentStats) === JSON.stringify(statistics) && 
            JSON.stringify(currentUserVote) === JSON.stringify(userVote)) {
          return { ...state, loading: false };
        }
        
        return {
          ...state,
          loading: false,
          votes: [...state.votes.filter(v => v.offre !== offreId), ...votes],
          statistics: {
            ...state.statistics,
            [offreId]: statistics
          },
          userVotes: {
            ...state.userVotes,
            [offreId]: userVote
          }
        };
    // case FETCH_VOTES_SUCCESS:
    //   const { votes, statistics, userVote } = action.payload.data;
    //   const offreId = votes[0]?.offre || userVote?.offre;
      
    //   return {
    //     ...state,
    //     loading: false,
    //     votes: [...state.votes.filter(v => v.offre !== offreId), ...votes],
    //     statistics: {
    //       ...state.statistics,
    //       [offreId]: statistics
    //     },
    //     userVotes: {
    //       ...state.userVotes,
    //       [offreId]: userVote
    //     }
    //   };
    
    case CREATE_VOTE_FAILURE:
    case FETCH_VOTES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    
    default:
      return state;
  }
};