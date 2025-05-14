const express = require("express");
const router = express.Router();
const contractController = require("../controllers/contractController");
const authMiddleware = require("../middlewares/authMiddleware");

// 🟢 AdminEntreprise : Créer un contrat
router.post("/create", authMiddleware(['AdminEntreprise']), contractController.createContract);  // Créer un contrat
router.get("/sent/:id_entreprise", authMiddleware(['AdminEntreprise']), contractController.getSentContracts);  // Voir contrats envoyés

// 🔵 Fournisseur : Voir contrats reçus
router.get("/received/:id_fournisseur", authMiddleware(['Fournisseur']), contractController.getReceivedContracts);  // Voir contrats reçus
router.put("/validate/:contractId", authMiddleware(['Fournisseur']), contractController.validateContract);  // Valider ou refuser
router.put("/sign/:contractId", authMiddleware(['Fournisseur']), contractController.signContract);  // Signer un contrat
// 🔵 Employé : Voir les offres actives de son entreprise
router.get("/offres-actives-employe", authMiddleware(["Employé"]), contractController.getActiveOffersForEmploye);
router.get("/offres-non-actives-employe", authMiddleware(["Employé"]), contractController.getInactiveOffersForEmploye);

module.exports = router;
