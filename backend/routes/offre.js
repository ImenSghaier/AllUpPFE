const express = require('express'); 
const router = express.Router();
const Offre = require('../models/offre');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cron = require('node-cron'); // Pour la mise à jour automatique

let filename = '';

const mystorage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, redirect) => {
        let date = Date.now();
        let fl = date + '.' + file.mimetype.split('/')[1];
        redirect(null, fl);
        filename = fl;
    }
});
const upload = multer({ storage: mystorage });

// Middleware pour vérifier l'authentification
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send({ message: "Accès refusé, aucun token fourni" });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), '12345678'); // Remplacez par votre clé secrète
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send({ message: "Token invalide" });
    }
};

// Calculer le prix après réduction ou promotion
const calculerPrixApresReductionOuPromotion = (prix, pourcentage_reduction, type) => {
    if (type === "REDUCTION") {
        return pourcentage_reduction ? prix - (prix * pourcentage_reduction / 100) : prix;
    } else if (type === "PROMOTION") {
        // Par exemple, une promotion pourrait donner un prix fixe (exemple ici 50)
        return 50;  // Exemple : prix fixe de 50 pour une promotion
    }
    return prix; // Par défaut, on retourne le prix sans changement si le type ne correspond pas
};

router.post('/add', verifyToken, upload.single('image'), async (req, res) => {
    try {
        if (req.user.role !== 'Fournisseur') {
            return res.status(403).send({ message: "Accès refusé. Seuls les fournisseurs peuvent ajouter une offre." });
        }

        // Vérifier que tous les champs obligatoires sont présents
        const champsObligatoires = ["titre", "description", "prix", "type", "date_debut", "date_fin", "categorie"];
        for (let champ of champsObligatoires) {
            if (!req.body[champ]) {
                return res.status(400).json({ message: `Le champ ${champ} est obligatoire.` });
            }
        }

        // ✅ Convertir les valeurs en nombres et dates
        const prix = parseFloat(req.body.prix);
        const pourcentage_reduction = parseFloat(req.body.pourcentage_reduction || 0);
        const date_debut = new Date(req.body.date_debut);
        const date_fin = new Date(req.body.date_fin);

        // Vérifier si les conversions sont valides
        if (isNaN(prix)) {
            return res.status(400).json({ message: "Le prix doit être un nombre valide." });
        }
        if (isNaN(pourcentage_reduction)) {
            return res.status(400).json({ message: "Le pourcentage de réduction doit être un nombre valide." });
        }
        if (isNaN(date_debut.getTime()) || isNaN(date_fin.getTime())) {
            return res.status(400).json({ message: "Les dates doivent être valides (format YYYY-MM-DD)." });
        }

        // Calcul du prix après réduction ou promotion
        const prix_apres_reduction = calculerPrixApresReductionOuPromotion(prix, pourcentage_reduction, req.body.type);
        const statut = date_fin < new Date() ? "EXPIRÉ" : "ACTIF";

        // Création de l'offre
        const offre = new Offre({
            titre: req.body.titre,
            description: req.body.description,
            prix,
            type: req.body.type,
            pourcentage_reduction,
            prix_apres_reduction,
            date_debut,
            date_fin,
            categorie: req.body.categorie,
            statut,
            image: req.file?.filename || "",
            id_fournisseur: req.user._id
        });

        const savedOffre = await offre.save();
        res.status(200).send(savedOffre);

    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).send(error);
    }
});

// Route pour récupérer les offres d'un fournisseur spécifique
router.get('/all', verifyToken, async (req, res) => {
    try {
        // Récupérer les paramètres depuis la requête
        const { page = 1, limit = 10, sortBy = 'titre', sortOrder = 'asc', categorie, type, search } = req.query;

        // Définir la pagination
        const skip = (page - 1) * limit;
        const query = { id_fournisseur: req.user._id }; // Filtrer par fournisseur connecté

        // Filtrer par catégorie (si défini)
        if (categorie) {
            query.categorie = categorie;
        }

        // Filtrer par type (si défini)
        if (type) {
            query.type = type;
        }

        // Ajouter la recherche par titre et description
        if (search) {
            query.$or = [
                { titre: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Appliquer le tri
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Récupérer les offres avec la pagination, tri, et filtres
        const offres = await Offre.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .sort(sort);

        // Récupérer le nombre total d'offres pour la pagination
        const totalOffres = await Offre.countDocuments(query);

        // Retourner les résultats avec pagination
        res.status(200).json({
            totalOffres,
            totalPages: Math.ceil(totalOffres / limit),
            currentPage: parseInt(page),
            offres
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route pour récupérer une offre par son ID
// router.get('/byid/:id', verifyToken, async (req, res) => {
//     try {
//         const offre = await Offre.findOne({ _id: req.params.id, id_fournisseur: req.user._id }); // Vérifier que l'offre appartient au fournisseur
//         if (!offre) {
//             return res.status(404).send({ message: "Offre non trouvée ou accès interdit" });
//         }
//         res.send(offre);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });

// 🟢 Route pour supprimer une offre (seulement pour le fournisseur propriétaire de l'offre)
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const deletedOffre = await Offre.findOneAndDelete({ _id: req.params.id, id_fournisseur: req.user._id });
        if (!deletedOffre) {
            return res.status(404).send({ message: "Offre non trouvée ou accès interdit" });
        }
        res.status(200).send(deletedOffre);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route pour mettre à jour une offre (seulement pour le fournisseur propriétaire de l'offre)
router.put('/update/:id', verifyToken, async (req, res) => {
    try {
        const { prix, pourcentage_reduction, date_fin } = req.body;
        let newData = { ...req.body };

        // Vérification que l'offre appartient au fournisseur connecté
        const offre = await Offre.findOne({ _id: req.params.id, id_fournisseur: req.user._id });
        if (!offre) {
            return res.status(404).send({ message: "Offre non trouvée ou accès interdit" });
        }

        // Recalcul du prix après réduction si nécessaire
        if (prix !== undefined && pourcentage_reduction !== undefined) {
            newData.prix_apres_reduction = calculerPrixApresReductionOuPromotion(prix, pourcentage_reduction, req.body.type);
        }

        // Mise à jour du statut en fonction de la date de fin
        if (date_fin) {
            newData.statut = new Date(date_fin) < new Date() ? "EXPIRÉ" : "ACTIF";
        }

        const updatedOffre = await Offre.findByIdAndUpdate(req.params.id, newData, { new: true });
        res.status(200).send(updatedOffre);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/all-paginated', async (req, res) => {
    try {
        const { page = 1, limit = 9, sortBy = 'titre', sortOrder = 'asc', categorie, type, search } = req.query;

        // Définition du skip pour la pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const query = {};

        // Filtrer par catégorie si fournie
        if (categorie) {
            query.categorie = categorie;
        }

        // Filtrer par type d'offre si fourni
        if (type) {
            query.type = type;
        }

        // Ajouter la recherche par titre et description
        if (search) {
            query.$or = [
                { titre: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Appliquer le tri
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Récupérer les offres avec pagination
        const offres = await Offre.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .sort(sort);

        // Nombre total d'offres
        const totalOffres = await Offre.countDocuments(query);

        res.status(200).json({
            totalOffres,
            totalPages: Math.ceil(totalOffres / limit),
            currentPage: parseInt(page),
            offres
        });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
router.get('/:id', async (req, res) => {
    try {
      const offre = await Offre.findById(req.params.id);
      if (!offre) return res.status(404).json({ message: 'Offre non trouvée' });
      res.json(offre);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
cron.schedule('0 0 * * *', async () => { 
    try {
        const now = new Date();
        await Offre.updateMany({ date_fin: { $lt: now } }, { $set: { statut: "EXPIRÉ" } });
        console.log("Mise à jour des statuts des offres expirées.");
    } catch (error) {
        console.error("Erreur lors de la mise à jour automatique des statuts :", error);
    }
});


module.exports = router;
