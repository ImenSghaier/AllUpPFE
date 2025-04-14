const Contract = require("../models/contract"); 
const Utilisateur = require('../models/utilisateur');
// 🔵 Socket.io (On le configure dans server.js)
let io;
const setSocketIo = (socketIoInstance) => {
  io = socketIoInstance;
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
// // Vérification des contrats pour changer leur statut à EXPIRE si la date est dépassée
// contracts = contracts.map(contract => {
//   if (contract.statut === "ACTIF" && new Date(contract.date_fin) < new Date()) {
//     contract.statut = "EXPIRE";
//     contract.save();  // Sauvegarder le contrat mis à jour
//   }
//   return contract;
// });

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
    //  // Vérification des contrats pour changer leur statut à EXPIRE si la date est dépassée
    //  contracts = contracts.map(contract => {
    //   if (contract.statut === "ACTIF" && new Date(contract.date_fin) < new Date()) {
    //     contract.statut = "EXPIRE";
    //     contract.save();  // Sauvegarder le contrat mis à jour
    //   }
    //   return contract;
    // });
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // 🔵 Fournisseur : Valider ou refuser un contrat
// exports.validateContract = async (req, res) => {
//   try {
//     const { contractId } = req.params;
//     const { statut } = req.body; // "ACTIF" ou "Refusé"

//     if (!["ACTIF", "REFUSÉ"].includes(statut)) {
//       return res.status(400).json({ message: "Statut invalide" });
//     }

//     const contract = await Contract.findByIdAndUpdate(contractId, { statut }, { new: true });

//     if (!contract) {
//       return res.status(404).json({ message: "Contrat non trouvé" });
//     }
    
//     if (io) {
//       io.to(contract.id_entreprise.toString()).emit("contractUpdated", contract);
//     }

//     res.status(200).json({ message: "Contrat mis à jour", contract });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };




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

    // // Notifier aussi l’entreprise via sa room si configurée
    // if (io) {
    //   io.to(contract.id_entreprise.toString()).emit("contractUpdated", contract);
    // }

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
