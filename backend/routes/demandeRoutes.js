const express = require('express');
const router = express.Router();
const demandeController = require('../controllers/demandeController');
const authMiddleware = require('../middlewares/authMiddleware');

// Créer une demande (employé)
router.post('/create', authMiddleware(["Employé"]), demandeController.creerDemande);

// Obtenir les demandes envoyées par un employé
router.get('/envoyees', authMiddleware(["Employé"]), demandeController.getDemandesEmploye);

// Obtenir les demandes reçues par l’AdminEntreprise
router.get('/recues', authMiddleware(["AdminEntreprise"]), demandeController.getDemandesAdmin);

// Approuver ou rejeter une demande
router.put('/:id/statut', authMiddleware(["AdminEntreprise"]), demandeController.changerStatut);

module.exports = router;
