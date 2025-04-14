const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/utilisateur');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const authMiddleware = require('../middlewares/authMiddleware');

dotenv.config();

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Fonction pour envoyer un email avec le mot de passe
const sendPasswordEmail = async (email, password) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Création de compte',
        text: `Votre compte a été créé. Voici vos identifiants :\nEmail : ${email}\nMot de passe : ${password}`
    };
    await transporter.sendMail(mailOptions);
};

// Génération et hachage du mot de passe
const generateHashedPassword = () => {
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = bcrypt.hashSync(password, 8);
    return { password, hashedPassword };
};

// 🚀 **Authentification**
router.post('/login', async (req, res) => {
    const { email, mot_de_passe } = req.body;

    if (email === 'imensghaier286@gmail.com' && mot_de_passe === '12345678') {
        const token = jwt.sign({ email, role: 'Administrateur' }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return res.status(200).json({ token });
    }

    const user = await Utilisateur.findOne({ email });
    if (!user || !bcrypt.compareSync(mot_de_passe, user.mot_de_passe)) {
        return res.status(401).json({ message: 'Email ou mot de passe invalide !' });
    }
// Ajouter id_entreprise dans le token pour AdminEntreprise
const tokenData = { _id: user._id, email: user.email, role: user.role };
if (user.role === 'AdminEntreprise') {
    tokenData.id_entreprise = user.id_entreprise; // Inclure id_entreprise pour AdminEntreprise
}

const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '24h' });
res.status(200).json({ token });
});

// 🚀 **Création d'un utilisateur (Administrateur uniquement)**
router.post('/create-user', authMiddleware(['Administrateur']), async (req, res) => {
    try {
        const { nom, email, telephone, role, id_entreprise } = req.body;

        if (!['Fournisseur', 'AdminEntreprise'].includes(role)) {
            return res.status(400).json({ message: 'Rôle non autorisé !' });
        }

        const existingUser = await Utilisateur.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'L\'email est déjà utilisé !' });
        }

        const { password, hashedPassword } = generateHashedPassword();
        
        // Vérifier si l'ID entreprise doit être stocké
        let entrepriseId = null;
        if (role === "AdminEntreprise") {
            entrepriseId = id_entreprise || null;
        }

        const newUser = new Utilisateur({ nom, email, telephone, role, id_entreprise: entrepriseId, mot_de_passe: hashedPassword });
        await newUser.save();
        await sendPasswordEmail(email, password);

        res.status(201).json(newUser);
    } catch (err) {
        console.error("❌ Erreur lors de la création de l'utilisateur :", err);
        res.status(400).json(err);
    }
});



// 🚀 **Mise à jour d'un utilisateur (Administrateur)**
router.put('/update-user/:id', authMiddleware(['Administrateur']), async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Vérifier si l'administrateur peut modifier le rôle
        if (!req.user || req.user.role !== 'Administrateur') {
            delete updateData.role; // Empêcher la modification du rôle si l'utilisateur n'est pas administrateur
        }

        // Vérifier si le champ id_entreprise doit être mis à jour
        if (updateData.role !== "AdminEntreprise" && updateData.role !== "Employé") {
            updateData.id_entreprise = null; // Effacer id_entreprise si rôle non valide
        }

        const updatedUser = await Utilisateur.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json(err);
    }
});




// 🚀 **Suppression d'un utilisateur**
router.delete('/delete/:id', authMiddleware(['Administrateur']), async (req, res) => {
    try {
        const user = await Utilisateur.findByIdAndDelete(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(400).json(err);
    }
});


router.get('/users', async (req, res) => {
    try {
        // 🔹 Récupération des paramètres de requête
        const { page = 1, search = "", sortBy = "nom", role } = req.query;
        const query = { role: { $in: ['Fournisseur', 'AdminEntreprise','Employé'] } };

        // 🔹 Filtrer les utilisateurs par recherche (nom ou email)
        if (search) {
            query.$or = [
                { nom: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        // 🔹 Filtrer par rôle si un rôle spécifique est demandé
        if (role) {
            query.role = role;
        }

        // 🔹 Pagination
        const limit = 10;
        const skip = (page - 1) * limit;

        // 🔹 Récupération des utilisateurs avec tri et pagination
        const users = await Utilisateur.find(query)
            .sort({ [sortBy]: 1 })  // Tri dynamique
            .skip(skip)
            .limit(limit);

        // 🔹 Compter le nombre total de résultats pour la pagination
        const totalUsers = await Utilisateur.countDocuments(query);

        // 🔹 Envoyer les résultats
        res.json({
            users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: Number(page),
            totalUsers
        });

    } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs :", err);
        res.status(500).json({ message: "Erreur serveur", error: err });
    }
});

// 🚀 **Création d'un employé (AdminEntreprise uniquement)**
// 🚀 **Création d'un employé (AdminEntreprise uniquement)**
router.post('/create-employee', authMiddleware(['AdminEntreprise']), async (req, res) => {
    try {
        const { nom, email, telephone } = req.body;
        const adminEntreprise = req.user; // Récupérer l'AdminEntreprise connecté via le token

        console.log("🔍 AdminEntreprise connecté :", adminEntreprise); // 👀 Debug

        if (!adminEntreprise || !adminEntreprise.id_entreprise) {
            return res.status(400).json({ message: "AdminEntreprise non valide ou ID entreprise manquant" });
        }

        // Vérifier si l'email existe déjà
        const existingUser = await Utilisateur.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "L'email est déjà utilisé !" });
        }

        // Création du mot de passe aléatoire
        const { password, hashedPassword } = generateHashedPassword();
        
        // Créer le nouvel employé avec l'id_entreprise de l'AdminEntreprise
        const newEmployee = new Utilisateur({
            nom, 
            email, 
            telephone, 
            role: 'Employé', 
            id_entreprise: adminEntreprise.id_entreprise, // Attribuer automatiquement l'id_entreprise
            mot_de_passe: hashedPassword
        });

        // Sauvegarder l'employé et envoyer l'email avec les identifiants
        await newEmployee.save();
        await sendPasswordEmail(email, password);

        res.status(201).json(newEmployee);
    } catch (err) {
        console.error("❌ Erreur lors de la création de l'employé :", err);
        res.status(400).json({ message: "Erreur lors de l'ajout de l'employé", error: err });
    }
});

// 🚀 **Ajouter des employés depuis un fichier (CSV ou Excel)**
router.post('/import-employees', authMiddleware(['AdminEntreprise']), async (req, res) => {
    try {
        const adminEntreprise = req.user; // Récupérer l'AdminEntreprise connecté via le token

        if (!adminEntreprise || !adminEntreprise.id_entreprise) {
            return res.status(400).json({ message: "AdminEntreprise non valide ou ID entreprise manquant" });
        }

        const employeesData = req.body; // Récupérer les données envoyées par le frontend (fichier CSV ou Excel converti en JSON)

        // Vérifier que les données sont au bon format
        if (!Array.isArray(employeesData) || employeesData.length === 0) {
            return res.status(400).json({ message: "Aucune donnée valide d'employé trouvée dans le fichier." });
        }

        const newEmployees = [];

        // Itérer sur chaque employé et créer l'objet dans la base de données
        for (let emp of employeesData) {
            const { nom, email, telephone } = emp;

            if (!nom || !email || !telephone) {
                continue; // Passer l'employé si les données sont incomplètes
            }

            // Vérifier si l'email existe déjà
            const existingUser = await Utilisateur.findOne({ email });
            if (existingUser) {
                continue; // Passer l'employé si l'email est déjà pris
            }

            // Créer un mot de passe aléatoire
            const { password, hashedPassword } = generateHashedPassword();

            const newEmployee = new Utilisateur({
                nom,
                email,
                telephone,
                role: 'Employé',
                id_entreprise: adminEntreprise.id_entreprise, // Associer l'ID de l'entreprise
                mot_de_passe: hashedPassword
            });

            await newEmployee.save();
            await sendPasswordEmail(email, password); // Envoyer l'email avec les identifiants

            newEmployees.push(newEmployee); // Ajouter l'employé à la liste
        }

        res.status(201).json(newEmployees); // Retourner la liste des nouveaux employés créés
    } catch (err) {
        console.error("❌ Erreur lors de l'importation des employés :", err);
        res.status(400).json({ message: "Erreur lors de l'importation des employés", error: err });
    }
});

// 🚀 **Afficher les employés d'une entreprise (AdminEntreprise uniquement)**
router.get('/employees', authMiddleware(['AdminEntreprise']), async (req, res) => {
    try {
        const adminEntreprise = req.user;

        // Vérification : L'AdminEntreprise a-t-il bien un `id_entreprise` ?
        if (!adminEntreprise.id_entreprise) {
            return res.status(403).json({ message: "Accès interdit : ID entreprise manquant !" });
        }

        console.log("🔍 Recherche des employés pour l'entreprise ID :", adminEntreprise.id_entreprise); // Debug

        const employees = await Utilisateur.find({ 
            id_entreprise: adminEntreprise.id_entreprise, 
            role: 'Employé' 
        });

        if (employees.length === 0) {
            return res.status(200).json({ message: "Aucun employé trouvé pour cette entreprise." });
        }

        res.status(200).json(employees);
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des employés :", err);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des employés", error: err });
    }
});

router.put('/update-employee/:id', authMiddleware(['AdminEntreprise']), async (req, res) => {
    try {
        const { nom, email, telephone } = req.body;
        const adminEntreprise = req.user; // Récupérer l'AdminEntreprise connecté via le token

        console.log("🔍 AdminEntreprise connecté :", adminEntreprise);

        // Récupérer l'employé à partir de l'ID dans les paramètres de l'URL
        const employee = await Utilisateur.findById(req.params.id);

        console.log("🔍 Employé trouvé :", employee);

        // Vérification si l'employé existe et si c'est bien un employé de l'AdminEntreprise
        if (!employee) {
            return res.status(404).json({ message: "Employé non trouvé !" });
        }

        console.log("AdminEntreprise ID :", adminEntreprise.id_entreprise);
        console.log("Employé ID_Entreprise :", employee.id_entreprise);

        if (employee.role !== 'Employé' || employee.id_entreprise.toString() !== adminEntreprise.id_entreprise.toString()) {
            return res.status(403).json({ message: "Modification non autorisée !" });
        }

        // Mettre à jour les informations de l'employé
        employee.nom = nom || employee.nom;
        employee.email = email || employee.email;
        employee.telephone = telephone || employee.telephone;

        // Sauvegarder les modifications
        await employee.save();

        // Retourner l'employé modifié
        res.json(employee);
    } catch (err) {
        console.error("❌ Erreur lors de la mise à jour de l'employé :", err);
        res.status(400).json({ message: "Erreur lors de la mise à jour de l'employé", error: err });
    }
});


// 🚀 Suppression d'un employé (AdminEntreprise uniquement)
router.delete('/delete-employee/:id', authMiddleware(['AdminEntreprise']), async (req, res) => {
    try {
        const adminEntreprise = req.user; // Récupérer l'AdminEntreprise connecté via le token
        console.log("🔍 AdminEntreprise connecté :", adminEntreprise);

        // Récupérer l'employé à partir de l'ID dans les paramètres de l'URL
        const employee = await Utilisateur.findById(req.params.id);
        console.log("🔍 Employé trouvé :", employee);

        // Vérification si l'employé existe et si c'est bien un employé de l'AdminEntreprise
        if (!employee) {
            return res.status(404).json({ message: "Employé non trouvé !" });
        }

        console.log("AdminEntreprise ID :", adminEntreprise.id_entreprise);
        console.log("Employé ID_Entreprise :", employee.id_entreprise);

        if (employee.role !== 'Employé' || employee.id_entreprise.toString() !== adminEntreprise.id_entreprise.toString()) {
            return res.status(403).json({ message: "Suppression non autorisée !" });
        }

        // Supprimer l'employé
        await Utilisateur.findByIdAndDelete(req.params.id);
        res.json({ message: "Employé supprimé avec succès !" });
    } catch (err) {
        console.error("❌ Erreur lors de la suppression de l'employé :", err);
        res.status(400).json({ message: "Erreur lors de la suppression de l'employé", error: err });
    }
});

module.exports = router;
