import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import { offreEmployeReducer } from './reducers/offreReducer';
import profilReducer from './reducers/profilReducer';
import demandeReducer from './reducers/demandeReducer';
import reservationReducer from './reducers/reservationReducer';
import offreFReducer from './reducers/offreFReducer';
import { contractReducer } from './reducers/contractReducer';
import { voteReducer } from './reducers/voteReducer';
const store = configureStore({
  reducer: {
    auth: authReducer,
    offreEmploye: offreEmployeReducer,
    profil: profilReducer,
    demande: demandeReducer,
    reservation:reservationReducer,
    offre:offreFReducer,
    contract:contractReducer,
    vote:voteReducer,
  },
});

export default store;
