const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
    commentaire: {
        type: String,
        trim: true,
        maxlength: 500
    },
    isPositive: {
        type: Boolean,
        required: true
    },
    offre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offre",
        required: true,
        index: true
    },
    employe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Utilisateur",
        required: true,
        index: true
    },
  
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index composé pour garantir l'unicité
VoteSchema.index({ employe: 1, offre: 1 }, { unique: true });

// Méthode statique pour vérifier si un employé a déjà voté
VoteSchema.statics.hasAlreadyVoted = async function(employeId, offreId) {
    const count = await this.countDocuments({ employe: employeId, offre: offreId });
    return count > 0;
};

module.exports = mongoose.model('VoteEmploye', VoteSchema);