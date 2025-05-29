const Reservation = require("../models/reservation");

// Créer une réservation
exports.createReservation = async (req, res) => {
    try {
        const { id_employe, id_offre } = req.body;

        const nouvelleReservation = new Reservation({
            statut: "EN_ATTENTE",
            id_employe,
            id_offre,
        });

        const savedReservation = await nouvelleReservation.save();
        res.status(201).json(savedReservation);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la réservation", error });
    }
};

// Obtenir les réservations d’un employé
exports.getReservationsByEmploye = async (req, res) => {
    try {
        const { id_employe } = req.params;

        const reservations = await Reservation.find({ id_employe })
            .populate("id_offre") // pour afficher les détails de l’offre
            .populate("id_employe", "nom email"); // optionnel : afficher info employé

        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des réservations", error });
    }
};
// Mettre à jour le statut d'une réservation (confirmation par scan)
exports.confirmReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;
        
        const updatedReservation = await Reservation.findByIdAndUpdate(
            reservationId,
            { statut: "CONFIRMÉE" },
            { new: true }
        ).populate("id_offre").populate("id_employe");

        if (!updatedReservation) {
            return res.status(404).json({ message: "Réservation non trouvée" });
        }

        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({ 
            message: "Erreur lors de la confirmation de la réservation", 
            error 
        });
    }
};

// Obtenir les réservations par offre (pour le fournisseur)
exports.getReservationsByOffre = async (req, res) => {
    try {
        const { id_offre } = req.params;
        
        const reservations = await Reservation.find({ id_offre })
            .populate("id_employe")
            .populate("id_offre");

        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ 
            message: "Erreur lors de la récupération des réservations", 
            error 
        });
    }
};

exports.getReservationsConfirmeesByEmploye = async (req, res) => {
    try {
        const { id_employe } = req.params;

        const reservations = await Reservation.find({ 
            id_employe,
            statut: "CONFIRMÉE"
        })
        .populate("id_offre")
        .populate("id_employe", "nom email");

        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ 
            message: "Erreur lors de la récupération des réservations confirmées", 
            error 
        });
    }
};