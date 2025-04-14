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

module.exports = router;




// const express = require("express");
// const router = express.Router();
// const Contract = require("../models/contract");
// const jwt = require("jsonwebtoken");
// const io = require("socket.io");  // Assurez-vous d'avoir configuré le serveur Socket.io

// // Middleware pour extraire l'ID du fournisseur depuis le token
// const verifyToken = (req, res, next) => {
//     const token = req.headers.authorization;
//     if (!token) {
//         return res.status(403).json({ message: "Accès refusé, token manquant." });
//     }
//     try {
//         const decoded = jwt.verify(token.split(" ")[1], "12345678"); // Remplacez "SECRET_KEY" par votre clé secrète
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: "Token invalide." });
//     }
// };

// // Route pour envoyer un contrat "EN_ATTENTE"
// router.post("/create", verifyToken, async (req, res) => {
//     try {
//         const { clause, date_debut, date_fin, id_offre, id_fournisseur } = req.body;
//         const id_entreprise = req.user.id;  // Récupérer l'id_entreprise à partir du token

//         const newContract = new Contract({
//             id_offre,
//             id_fournisseur,
//             id_entreprise,
//             clause,
//             date_debut,
//             date_fin,
//             statut: "EN_ATTENTE", // Statut initial
//             signature_entreprise: false,  // L'entreprise signe plus tard
//             signature_fournisseur: false, // Le fournisseur signe plus tard
//         });

//         await newContract.save();

//         // Notification via Socket.io à l'id du fournisseur
//         io.emit("newContract", { message: "Un nouveau contrat est en attente de validation", id_fournisseur });

//         res.status(201).json({ message: "Contrat créé en attente", contract: newContract });
//     } catch (error) {
//         res.status(500).json({ message: "Erreur lors de la création du contrat." });
//     }
// });

// // Route pour valider un contrat (le fournisseur signe)
// router.post("/validate", async (req, res) => {
//     try {
//         const { id_offre, id_fournisseur, id_entreprise, clause, date_debut, date_fin, signature_entreprise } = req.body;

//         if (!signature_entreprise) {
//             return res.status(400).json({ message: "L'entreprise doit signer avant validation." });
//         }

//         const newContract = new Contract({
//             id_offre,
//             id_fournisseur,
//             id_entreprise,
//             clause,
//             date_debut,
//             date_fin,
//             statut: "ACTIF", // Le contrat devient actif après validation
//             signature_entreprise: true,
//             signature_fournisseur: true, // Le fournisseur signe en validant
//         });

//         await newContract.save();
//         res.status(201).json({ message: "Contrat validé et enregistré.", contract: newContract });

//     } catch (error) {
//         res.status(500).json({ message: "Erreur lors de la validation du contrat." });
//     }
// });

// // Modifier ou supprimer un contrat en fonction du statut
// router.post("/refuser", async (req, res) => {
//     try {
//         const { id_offre } = req.body;
//         await Contract.updateOne({ id_offre }, { statut: "EXPIRÉ" });
//         res.status(200).json({ message: "Contrat refusé." });
//     } catch (error) {
//         res.status(500).json({ message: "Erreur lors du refus du contrat." });
//     }
// });

// module.exports = router;


// // const express = require("express");
// // const router = express.Router();
// // const Contract = require("../models/contract");
// // const jwt = require("jsonwebtoken"); // Pour extraire l'ID depuis le token (si nécessaire)

// // // Middleware pour extraire l'ID du fournisseur depuis le token
// // const verifyToken = (req, res, next) => {
// //     const token = req.headers.authorization;
// //     if (!token) {
// //         return res.status(403).json({ message: "Accès refusé, token manquant." });
// //     }
// //     try {
// //         const decoded = jwt.verify(token.split(" ")[1], "12345678"); // Remplace "SECRET_KEY" par ta vraie clé secrète
// //         req.user = decoded;
// //         next();
// //     } catch (error) {
// //         res.status(401).json({ message: "Token invalide." });
// //     }
// // };

// // // 📌 Route pour valider et enregistrer le contrat quand le fournisseur clique sur "Valider"
// // router.post("/validate", async (req, res) => {
// //     try {
// //         const { id_offre, id_fournisseur, id_entreprise, clause, date_debut, date_fin, signature_entreprise } = req.body;

// //         // Vérifier que l'entreprise a signé
// //         if (!signature_entreprise) {
// //             return res.status(400).json({ message: "L'entreprise doit signer avant validation." });
// //         }

// //         // Créer et sauvegarder le contrat
// //         const newContract = new Contract({
// //             id_offre,
// //             id_fournisseur,
// //             id_entreprise,
// //             clause,
// //             date_debut,
// //             date_fin,
// //             statut: "ACTIF", // Le contrat est actif après validation du fournisseur
// //             signature_entreprise: true,
// //             signature_fournisseur: true, // Le fournisseur signe en validant
// //         });

// //         await newContract.save();
// //         res.status(201).json({ message: "Contrat validé et enregistré.", contract: newContract });

// //     } catch (error) {
// //         res.status(500).json({ message: "Erreur lors de la validation du contrat." });
// //     }
// // });

// // // Récupérer tous les contrats d'un fournisseur connecté
// // router.get("/all", verifyToken, async (req, res) => {
// //     try {
// //         const id_fournisseur = req.user.id; // Récupérer l'ID du fournisseur depuis le token
// //         const contracts = await Contract.find({ id_fournisseur: id_fournisseur });
// //         res.status(200).send(contracts);
// //     } catch (error) {
// //         res.status(400).send(error);
// //     }
// // });

// // // Récupérer un contrat par ID (assurez-vous que le fournisseur ne peut voir que ses contrats)
// // router.get("/byid/:id", verifyToken, async (req, res) => {
// //     try {
// //         const id = req.params.id;
// //         const id_fournisseur = req.user.id; // Récupérer l'ID du fournisseur depuis le token
// //         const contract = await Contract.findOne({ _id: id, id_fournisseur: id_fournisseur });

// //         if (!contract) {
// //             return res.status(403).json({ message: "Accès interdit : Ce contrat ne vous appartient pas." });
// //         }

// //         res.send(contract);
// //     } catch (error) {
// //         res.status(400).send(error);
// //     }
// // });

// // // Supprimer un contrat (seulement si c'est le fournisseur qui l'a créé)
// // router.delete("/delete/:id", verifyToken, async (req, res) => {
// //     try {
// //         const id = req.params.id;
// //         const id_fournisseur = req.user.id;

// //         const contract = await Contract.findOne({ _id: id, id_fournisseur: id_fournisseur });
// //         if (!contract) {
// //             return res.status(403).json({ message: "Accès interdit : Ce contrat ne vous appartient pas." });
// //         }

// //         await Contract.findByIdAndDelete(id);
// //         res.status(200).json({ message: "Contrat supprimé avec succès." });
// //     } catch (error) {
// //         res.status(400).send(error);
// //     }
// // });

// // // Mettre à jour un contrat (seulement si c'est le fournisseur qui l'a créé)
// // router.put("/update/:id", verifyToken, async (req, res) => {
// //     try {
// //         const id = req.params.id;
// //         const newData = req.body;
// //         const id_fournisseur = req.user.id;

// //         const contract = await Contract.findOne({ _id: id, id_fournisseur: id_fournisseur });
// //         if (!contract) {
// //             return res.status(403).json({ message: "Accès interdit : Ce contrat ne vous appartient pas." });
// //         }

// //         const updated = await Contract.findByIdAndUpdate(id, newData, { new: true });
// //         res.status(200).send(updated);
// //     } catch (error) {
// //         res.status(400).send(error);
// //     }
// // });



// // // Refuser un contrat
// // router.post("/refuser", async (req, res) => {
// //     try {
// //         const { id_offre } = req.body;
// //         await Contract.updateOne({ id_offre }, { statut: "EXPIRÉ" });
// //         res.status(200).json({ message: "Contrat refusé." });
// //     } catch (error) {
// //         res.status(500).json({ message: "Erreur lors du refus du contrat." });
// //     }
// // });

// // module.exports = router;


// // // const express =require('express');
// // // const router =express.Router();
// // // const Contract= require('../models/contract'); 

// // // router.post('/add', (req , res)=>{
// // //         data =req.body;
// // //         c= new Contract(data);
// // //         c.save()
// // //             .then(
// // //                 (savedC)=>{ 
// // //                     res.status(200).send(savedC) 
// // //                 }
// // //             )
// // //             .catch(
// // //                 (err)=>{
// // //                     res.status(400).send(err)
// // //                 }
// // //             )
// // // });
// // // router.get('/all',async (req,res)=>{
// // //     try {
// // //         contract = await Contract.find();
// // //         res.status(200).send(contract);
// // //     } catch (error) {
// // //         res.status(400).send(error)
// // //     }
// // // })

// // // router.get('/byid/:id' , async (req,res)=>{
// // //     try {
// // //         id=req.params.id;
// // //         contract= await Contract.findOne({_id :id})
// // //         res.send(contract)
// // //     } catch (error) {
// // //         res.send(error)
// // //     }
// // // })

// // // router.delete('/delete/:id', async(req, res)=>{
// // //     try {
// // //         id=req.params.id
// // //         Delete = await Contract.findByIdAndDelete({_id:id});
// // //         res.status(200).send(Delete);
// // //     } catch (error) {
// // //         res.status(400).send(error)
// // //     }
// // // })


// // // router.put('/update/:id' , async(req,res)=>{
// // //     try {
// // //         id=req.params.id;
// // //         newData=req.body;
// // //         updated= await Contract.findByIdAndUpdate({_id:id} , newData);
// // //         res.status(200).send(updated)
// // //     } catch (error) {
// // //         res.status(400).send(error)
// // //     }
// // // })

// // // router.post("/", async (req, res) => {
// // //     try {
// // //         const { id_offre, id_fournisseur, clause, date_debut, date_fin, signature_entreprise } = req.body;

// // //         const contrat = new Contrat({
// // //             id_offre,
// // //             id_fournisseur,
// // //             id_entreprise: req.body.id_entreprise,
// // //             clause,
// // //             date_debut,
// // //             date_fin,
// // //             statut: "ACTIF",
// // //             signature_entreprise,
// // //             signature_fournisseur: true,
// // //         });

// // //         await contrat.save();
// // //         res.status(201).json({ message: "Contrat validé et enregistré !" });
// // //     } catch (error) {
// // //         res.status(500).json({ message: "Erreur lors de l'enregistrement du contrat." });
// // //     }
// // // });

// // // router.post("/refuser", async (req, res) => {
// // //     try {
// // //         const { id_offre } = req.body;
// // //         await Contrat.updateOne({ id_offre }, { statut: "EXPIRÉ" });
// // //         res.status(200).json({ message: "Contrat refusé." });
// // //     } catch (error) {
// // //         res.status(500).json({ message: "Erreur lors du refus du contrat." });
// // //     }
// // // });
// // // module.exports=router;