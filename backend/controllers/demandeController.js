const DemandeOffreEmploye = require('../models/demandeOffreEmploye');
const Utilisateur = require('../models/utilisateur');

exports.creerDemande = async (req, res) => {
    try {
        const { contenue, id_offre } = req.body; 
        const id_employe = req.user._id;
        const employe = await Utilisateur.findById(id_employe);

        if (!employe || employe.role !== "Employé") {
            return res.status(403).json({ message: "Accès refusé" });
        }

        // Trouver l'adminEntreprise de la même entreprise
        const adminEntreprise = await Utilisateur.findOne({
            role: "AdminEntreprise",
            id_entreprise: employe.id_entreprise
        });

        if (!adminEntreprise) {
            return res.status(404).json({ message: "AdminEntreprise introuvable" });
        }

        const demande = new DemandeOffreEmploye({
            statut: "EN_ATTENTE",
            contenue,
            id_employe,
            id_offre,
            id_entreprise: employe.id_entreprise
        });

        const saved = await demande.save();

        // Envoi via socket (ex: io est passé globalement)
        req.io.to(adminEntreprise._id.toString()).emit("nouvelle_demande", saved);

        res.status(201).json(saved);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'envoi de la demande" });
    }
};
exports.getDemandesEmploye = async (req, res) => {
    try {
        const id_employe = req.user.id;

        const demandes = await DemandeOffreEmploye.find({ id_employe })
            .populate("id_offre", "titre")
            .populate("id_entreprise");

        res.json(demandes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération" });
    }
};
exports.getDemandesAdmin = async (req, res) => {
    try {
        const admin = await Utilisateur.findById(req.user.id);

        if (admin.role !== "AdminEntreprise") {
            return res.status(403).json({ message: "Accès refusé" });
        }

        const demandes = await DemandeOffreEmploye.find({
            id_entreprise: admin.id_entreprise
        })
        .populate("id_employe")
        .populate("id_offre");

        res.json(demandes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération" });
    }
};
exports.changerStatut = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;

        if (!["APPROUVÉE", "REJETÉE"].includes(statut)) {
            return res.status(400).json({ message: "Statut invalide" });
        }

        const demande = await DemandeOffreEmploye.findByIdAndUpdate(
            id,
            { statut },
            { new: true }
        );

        res.json(demande);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du statut" });
    }
};
