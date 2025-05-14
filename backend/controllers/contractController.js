const Contract = require("../models/contract"); 
const Utilisateur = require('../models/utilisateur');
const cron = require('node-cron'); 
// 🔵 Socket.io (On le configure dans server.js)
let io;
const setSocketIo = (socketIoInstance) => {
  io = socketIoInstance;
};
const Offre = require("../models/offre");

// 🟡 Employé : Voir les offres actives de son entreprise (via les contrats actifs)
exports.getActiveOffersForEmploye = async (req, res) => {
  try {
    const idEntreprise = req.user.id_entreprise;

    if (!idEntreprise) {
      return res.status(400).json({ message: "Employé non lié à une entreprise." });
    }

    // Trouver les contrats ACTIF pour cette entreprise
    const contratsActifs = await Contract.find({
      id_entreprise: idEntreprise,
      statut: "ACTIF"
    });

    // Extraire les IDs des offres
    const offresIds = contratsActifs.map(contrat => contrat.id_offre);

    // Récupérer les offres correspondantes
    const offres = await Offre.find({
      _id: { $in: offresIds },
      // statut: "ACTIF"  // facultatif si tu veux t'assurer que l'offre est active
    });
    console.log("Contrats actifs trouvés :", contratsActifs);
    console.log("ID entreprise :", idEntreprise);

    res.status(200).json(offres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// exports.getNonActiveContractOffersForEmploye = async (req, res) => {
//   try {
//     const idEntreprise = req.user.id_entreprise;

//     if (!idEntreprise) {
//       return res.status(400).json({ message: "Employé non lié à une entreprise." });
//     }

//     // 🔍 Trouver les contrats ACTIFS de cette entreprise
//     const contratsActifs = await Contract.find({
//       id_entreprise: idEntreprise,
//       statut: "ACTIF"
//     });

//     // 🔁 Extraire les IDs des offres liées à cette entreprise
//     const offresLieesIds = contratsActifs.map(contrat => contrat.id_offre);

//     // ❌ Récupérer les offres actives qui ne sont PAS liées par contrat actif à cette entreprise
//     const offres = await Offre.find({
//       _id: { $nin: offresLieesIds },  // "$nin" = NOT IN
//       //  // facultatif si tu veux filtrer uniquement les offres actives
//     });

//     res.status(200).json(offres);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// 🟡 Employé : Voir les offres NON actives (pas sélectionnées dans un contrat actif de son entreprise)
exports.getInactiveOffersForEmploye = async (req, res) => {
  try {
    const idEntreprise = req.user.id_entreprise;

    if (!idEntreprise) {
      return res.status(400).json({ message: "Employé non lié à une entreprise." });
    }

    // Trouver les contrats ACTIFS pour cette entreprise
    const contratsActifs = await Contract.find({
      id_entreprise: idEntreprise,
      statut: "ACTIF"
    });

    // Extraire les IDs des offres qui SONT dans des contrats actifs
    const offresActivesIds = contratsActifs.map(contrat => contrat.id_offre);

    // Récupérer toutes les offres QUI NE SONT PAS dans les contrats actifs
    const offresInactives = await Offre.find({
      _id: { $nin: offresActivesIds }  // <-- important : $nin = "non inclus"
    });

    res.status(200).json(offresInactives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 AdminEntreprise : Créer un contrat
exports.createContract = async (req, res) => {
  try {
    // Utilisation de `id_entreprise` de `req.user` qui a été ajouté par le middleware
    const { id_fournisseur, id_offre, clause, date_debut, date_fin } = req.body;
    const { id_entreprise } = req.user;  // Récupérer l'id_entreprise depuis `req.user`

    console.log("Données reçues :", req.body);
    const newContract = new Contract({
      id_entreprise,  // Utilisation de l'ID de l'entreprise du middleware
      id_fournisseur,
      id_offre,
      clause,
      date_debut,
      date_fin,
      date_creation: Date.now(),  // Date de création automatiquement définie
    });

    await newContract.save();

    // 🔔 Notification en temps réel au fournisseur
    // if (io) {
    //   io.to(id_fournisseur.toString()).emit("newContract", newContract);
    // }
     // 🔔 Notification en temps réel au fournisseur
    io.to(id_fournisseur.toString()).emit("newCont", {
      title: "Contrat créer",
      message: `un nouveau contrat a été crée`,
      // contractId: contract._id
    });
    res.status(201).json({ message: "Contrat créé avec succès", contract: newContract });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 AdminEntreprise : Voir tous les contrats envoyés
exports.getSentContracts = async (req, res) => {
  try {
    const { id_entreprise } = req.user;  // Utiliser l'id_entreprise depuis `req.user`
    const contracts = await Contract.find({ id_entreprise }).populate("id_fournisseur id_offre");

    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔵 Fournisseur : Voir les contrats reçus
exports.getReceivedContracts = async (req, res) => {
  try {
    const { id_fournisseur } = req.params;
    const contracts = await Contract.find({ id_fournisseur }).populate("id_entreprise id_offre");
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
cron.schedule('0 0 * * *', async () => { 
    try {
        const now = new Date();
        await Contract.updateMany({ date_fin: { $lt: now } }, { $set: { statut: "EXPIRÉ" } });
        console.log("Mise à jour des statuts des contrats expirées.");
    } catch (error) {
        console.error("Erreur lors de la mise à jour automatique des statuts :", error);
    }
});

exports.validateContract = async (req, res) => {
  try {
    const { contractId } = req.params;
    const { statut } = req.body; // "ACTIF" ou "REFUSÉ"

    if (!["ACTIF", "REFUSÉ"].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const contract = await Contract.findByIdAndUpdate(
      contractId,
      { statut },
      { new: true }
    );

    if (!contract) {
      return res.status(404).json({ message: "Contrat non trouvé" });
    }

    // Envoi de la notification à l'admin de l'entreprise
    const adminEntreprise = await Utilisateur.findOne({
      id_entreprise: contract.id_entreprise,
      role: "AdminEntreprise"
    });
    if (adminEntreprise) {
      console.log('here', adminEntreprise._id.toString())
      io.to(adminEntreprise._id.toString()).emit("notification", {
        title: "Contrat mis à jour",
        message: `Le contrat a été ${statut == "ACTIF" ? "validé" : "refusé"}`,
        contractId: contract._id
      });
    }


    res.status(200).json({ message: "Contrat mis à jour", contract });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 🔵 Fournisseur : Signer un contrat
exports.signContract = async (req, res) => {
  try {
    const { contractId } = req.params;

    const contract = await Contract.findByIdAndUpdate(contractId, { signature_fournisseur: true }, { new: true });

    if (!contract) {
      return res.status(404).json({ message: "Contrat non trouvé" });
    }

    res.status(200).json({ message: "Contrat signé avec succès", contract });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.setSocketIo = setSocketIo;
