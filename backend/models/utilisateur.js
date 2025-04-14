

const mongoose = require('mongoose');

const Utilisateur =mongoose.model('Utilisateur', {

    nom:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    mot_de_passe: {
        type: String,
        required: true,
        minlength: 8
    },
    telephone:{
        type: String,
        required: true,
        match: [/^\+?[0-9]{7,15}$/, "Invalid phone number format"]  
    },
    role: {
        type: String,
        enum: ["Administrateur", "AdminEntreprise", "Fournisseur", "Employé"],
        required: true
    },
    id_entreprise:{
        type: mongoose.Types.ObjectId,
        ref:"Entreprise",
        default: null
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }

})

module.exports = Utilisateur;