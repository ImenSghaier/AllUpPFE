const User = require('../models/utilisateur');
const Offre = require('../models/offre');
const Contrat = require('../models/contract');

const getStatistics = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const offreCount = await Offre.countDocuments();
    const contratCount = await Contrat.countDocuments();

    res.status(200).json({
      users: userCount,
      offres: offreCount,
      contrats: contratCount
    });
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getStatistics };
