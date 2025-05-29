// services/voteService.js
import { refreshToken } from "../context/functions";

export const createVote = async (offreId, isPositive, commentaire) => {
  let http = await refreshToken();
  const res = await http.post("/vote", {  // Retirez le slash final
    offreId,  // Gardez offreId pour correspondre au backend
    isPositive,
    commentaire
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return res.data;
};

export const getVotesForOffer = async (offreId) => {
  let http = await refreshToken();
  const res = await http.get(`/vote/offres/${offreId}/votes`);
  return res.data;
};

