import { applyMiddleware, combineReducers,  createStore } from "redux";
import authReducer from "./reducers/authReducer";
import { thunk } from "redux-thunk";
import { entrepriseReducer } from "./reducers/entrepriseReducer";
import userReducer from "./reducers/userReducer";
import { employeReducer } from "./reducers/employeReducer";
import offreReducer from "./reducers/offreReducer";
import contractReducer from "./reducers/contractReducer";

const rootReducer = combineReducers({ 
    auth:authReducer,
    entreprise:entrepriseReducer,
    userReducer,
    employe:employeReducer,
    offre:offreReducer,
    contract:contractReducer,
});

const store =createStore(rootReducer, applyMiddleware(thunk)); //permet d'utiliser des actions asynchrones.


export default store;
