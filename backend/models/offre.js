const mongoose = require('mongoose'); 

const Offre = mongoose.model('Offre', {
    titre: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    prix: {
        type: Number,  // Type changé en Number pour des calculs plus précis
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["PROMOTION", "REDUCTION"]
    },
    pourcentage_reduction: {
        type: Number, // En pourcentage (ex: 10 pour 10%)
        min: 0,
        max: 100
    },
    prix_apres_reduction: {
        type: Number
    },
    date_debut: {
        type: Date,
        required: true
    },
    date_fin: {
        type: Date,
        required: true
    },
    categorie: {
        type: String,
        required: true,
        trim: true,
        enum: [
            "Hotels & vacations", 
            "Shopping", 
            "Santé & bien-être", 
            "Restaurant & lounge", 
            "Formation & workshop", 
            "Transports", 
            "Événements & loisirs", 
            "Culture"
        ]
    },
    image: {
        type: String
    },
    statut: {
        type: String,
        enum: ["ACTIF", "EXPIRÉ"],
        default: "ACTIF",
        required: true
    },
    id_fournisseur: {
        type: mongoose.Types.ObjectId,
        ref: "Utilisateur",
        required: true
    }
});

module.exports = Offre;
