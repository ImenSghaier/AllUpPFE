const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");

// Route pour créer une réservation
router.post("/nvReservation", reservationController.createReservation);

// Route pour récupérer les réservations d’un employé
router.get("/employe/:id_employe", reservationController.getReservationsByEmploye);
// Route pour confirmer une réservation (scan QRCode)
router.put("/confirmer/:reservationId", reservationController.confirmReservation);

// Route pour récupérer les réservations par offre
router.get("/offre/:id_offre", reservationController.getReservationsByOffre);
module.exports = router;
