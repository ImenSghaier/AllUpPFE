const mongoose = require('mongoose');

const Reservation =mongoose.model('Reservation', {

    
    statut: {
        type: String,
        required:true,
        enum: ["EN_ATTENTE", "CONFIRMÉE", "ANNULÉE"],
    },
    id_employe:{
        type: mongoose.Types.ObjectId,
        ref:"Utilisateur",
        required:true
    },
    id_offre:{
        type: mongoose.Types.ObjectId,
        ref:"Offre",
        required:true
    },
    date_reservation:{
        type : Date,
        default: Date.now
    }

})

module.exports = Reservation;