const express = require('express');
const router = express.Router();
const VoteEmploye = require('../models/voteEmploye');
const Offre = require('../models/offre');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/', authMiddleware(['Employé']), async (req, res) => {
    try {
        const { offreId, isPositive, commentaire } = req.body;
        const employeId = req.user.id;
       
        // Validate required fields
        if (!offreId || typeof isPositive !== 'boolean') {
            return res.status(400).json({ 
                success: false, 
                message: 'Les champs offreId et isPositive sont obligatoires' 
            });
        }

        // Check if employee has already voted for this offer
        const hasVoted = await VoteEmploye.hasAlreadyVoted(employeId, offreId);
        if (hasVoted) {
            return res.status(400).json({ 
                success: false, 
                message: 'Vous avez déjà voté pour cette offre' 
            });
        }

        // Create new vote
        const newVote = new VoteEmploye({
            commentaire: commentaire || '',
            isPositive,
            offre: offreId,
            employe: employeId,
          
        });

        await newVote.save();

        // Update offer statistics
        await updateOfferVoteStats(offreId);

        res.status(201).json({ 
            success: true, 
            data: newVote,
            message: 'Votre vote a été enregistré avec succès' 
        });
    } catch (error) {
        console.error('Error creating vote:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de l\'enregistrement du vote',
            error: error.message 
        });
    }
});
router.get('/offres/:id/votes', authMiddleware(['Fournisseur', 'Employé']), async (req, res) => {
    try {
        const offreId = req.params.id;

        // 1. Vérifier seulement si l'offre existe (sans vérifier l'entreprise)
        const offreExists = await Offre.exists({ _id: offreId });
        if (!offreExists) {
            return res.status(404).json({ 
                success: false, 
                message: 'Offre non trouvée' 
            });
        }

        // 2. Récupérer tous les votes pour cette offre
        const votes = await VoteEmploye.find({ offre: offreId })
            .populate('employe', 'nom prenom')
            .sort({ createdAt: -1 });

        // 3. Vérifier si l'utilisateur a déjà voté
        const userVote = await VoteEmploye.findOne({
            offre: offreId,
            employe: req.user.id
        });

        // 4. Calculer les statistiques
        const totalVotes = votes.length;
        const positiveVotes = votes.filter(v => v.isPositive).length;
        const positivePercentage = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0;

        // 5. Retourner la réponse
        res.status(200).json({ 
            success: true, 
            data: {
                votes,
                statistics: {
                    totalVotes,
                    positiveVotes,
                    negativeVotes: totalVotes - positiveVotes,
                    positivePercentage
                },
                userVote: userVote || null
            }
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur',
            error: error.message 
        });
    }
});
/**
 * Helper function to update vote statistics for an offer
 */
async function updateOfferVoteStats(offreId) {
    try {
        const votes = await VoteEmploye.find({ offre: offreId });
        const totalVotes = votes.length;
        const positiveVotes = votes.filter(v => v.isPositive).length;
        const positivePercentage = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0;

        await Offre.findByIdAndUpdate(offreId, {
            voteStats: {
                totalVotes,
                positiveVotes,
                positivePercentage
            }
        }, { new: true });
    } catch (error) {
        console.error('Error updating offer vote stats:', error);
        throw error;
    }
}

module.exports = router;