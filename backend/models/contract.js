const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
  statut: {
    type: String,
    enum: ["EN_ATTENTE", "ACTIF", "EXPIRÉ" ,"REFUSÉ"],
    required: true,
    default: "EN_ATTENTE",  
  },

  clause: {
    type: String,
    required: true,
    trim: true,
  },

  date_debut: {
    type: Date,
    required: true,
  },

  date_fin: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > this.date_debut;
      },
      message: "La date de fin doit être après la date de début",
    },
  },

  signature_fournisseur: {
    type: Boolean,
    default: false,  
  },

  signature_entreprise: {
    type: Boolean,
    default: true,
  },

  date_creation: {
    type: Date,
    default: Date.now,
    immutable: true,  
  },

  id_fournisseur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur",
    required: true,
  },

  id_offre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offre",
    required: true,
  },

  id_entreprise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Entreprise",
    required: true,
  },
});

module.exports = mongoose.model("Contract", contractSchema);
