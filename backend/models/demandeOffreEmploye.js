const mongoose = require('mongoose');

const DemandeOffreEmploye =mongoose.model('Demande_Offre_Employe', {

    statut: {
        type: String,
        enum: ["EN_ATTENTE", "APPROUVÉE", "REJETÉE"],
        required: true
    },
    contenue: {
        type: String,
        required: true,
        trim: true
    },
    date_demande:{
        type: Date,
        default: Date.now
    },
    id_employe:{
        type: mongoose.Types.ObjectId,
        ref:"Utilisateur",
        require:true
    },
    id_offre:{
        type: mongoose.Types.ObjectId,
        ref:"Offre",
        require:true
    },
    id_entreprise:{
        type: mongoose.Types.ObjectId,
        ref:"Entreprise",
        require:true
    }

})

module.exports = DemandeOffreEmploye;