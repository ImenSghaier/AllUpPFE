const mongoose = require('mongoose');

const VoteEmploye =mongoose.model('Vote_Employe', {

    commantaire:{
        type: String,
        required: false,
        lowercase: true
    },
    vote:{
        type: Number,
        min: 1, 
        max: 5, 
        required: false
    },
    id_offre:{
        type: mongoose.Types.ObjectId,
        ref:"Offre",
        required:true
    },
    id_employe:{
        type: mongoose.Types.ObjectId,
        ref:"Utilisateur",
        required:true
    }

})

module.exports = VoteEmploye;