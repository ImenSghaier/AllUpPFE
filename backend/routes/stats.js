// routes/stats.js
const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/utilisateur');
const Offre = require('../models/offre');
const Contract = require('../models/contract');

// Statistiques globales
router.get('/summary', async (req, res) => {
  try {
    const userCount = await Utilisateur.countDocuments();
    const offerCount = await Offre.countDocuments();
    const conventionCount = await Contract.countDocuments();
    
    res.json({
      users: userCount,
      offers: offerCount,
      contracts: conventionCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Détails utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await Utilisateur.find().sort({ createdAt: -1 }).limit(10);
    const activeUsers = await Utilisateur.countDocuments({ isActive: true });
    const newUsers = await Utilisateur.countDocuments({ 
      createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } 
    });
    
    res.json({
      recentUsers: users,
      activeUsers,
      newUsers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Détails offres
router.get('/offers', async (req, res) => {
  try {
    const offers = await Offre.find().sort({ createdAt: -1 }).limit(10);
    const activeOffers = await Offre.countDocuments({ isActive: true });
    const popularOffers = await Offre.find().sort({ views: -1 }).limit(5);
    
    res.json({
      recentOffers: offers,
      activeOffers,
      popularOffers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Détails contrats
router.get('/contracts', async (req, res) => {
  try {
    const recentContracts = await Contract.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('id_entreprise', 'nom') // Adaptez selon vos besoins
      .populate('id_fournisseur', 'nom '); // Adaptez selon vos besoins

    const activeContracts = await Contract.countDocuments({ 
      status: { $in: ['EN_ATTENTE', 'ACTIF', 'EXPIRÉ','REFUSÉ'] } // Adaptez selon vos statuts
    });

    const expiringSoon = await Contract.find({ 
      dateFin: { 
        $gte: new Date(),
        $lte: new Date(Date.now() + 30*24*60*60*1000) // 30 jours
      }
    })
    .limit(5)
    .populate('id_entreprise', 'nom'); // Adaptez selon vos besoins

    res.json({
      recentContracts,
      activeContracts,
      expiringSoon
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;