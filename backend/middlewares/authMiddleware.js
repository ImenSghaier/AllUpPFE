const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/utilisateur'); // Import du modèle utilisateur

const authMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            // Vérifier si l'en-tête Authorization est présent
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                console.log("🚫 Authorization header manquant");
                return res.status(401).json({ message: 'Accès refusé, token manquant' });
            }

            // Extraire le token après "Bearer "
            const token = authHeader.split(" ")[1];
            if (!token) {
                console.log("🚫 Token manquant après 'Bearer '");
                return res.status(401).json({ message: 'Token invalide' });
            }

            // Vérifier le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            req.user.id = decoded._id; // pour utiliser req.user.id dans les contrôleurs

            console.log("Decoded Token:", decoded);  // Vérifiez ce que contient le token ici

            // Vérifier si l'utilisateur a un rôle autorisé
            if (allowedRoles && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: "Accès interdit !" });
            }

            // ✅ Si c'est un AdminEntreprise, récupérer `id_entreprise`
            if (decoded.role === 'AdminEntreprise') {
                const admin = await Utilisateur.findById(decoded._id).select('id_entreprise');
                
                // Vérifier si l'AdminEntreprise a un `id_entreprise`
                if (admin && admin.id_entreprise) {
                    req.user.id_entreprise = admin.id_entreprise; // Ajouter `id_entreprise` à `req.user`
                } else {
                    console.log("🔴 ID entreprise manquant pour l'AdminEntreprise");
                    return res.status(400).json({ message: "AdminEntreprise non valide ou ID entreprise manquant" });
                }
            }
            if (decoded.role === 'Employé') {
                const employe = await Utilisateur.findById(decoded._id).select('id_entreprise');
                if (employe && employe.id_entreprise) {
                    req.user.id_entreprise = employe.id_entreprise;
                } else {
                    console.log("🔴 ID entreprise manquant pour l'Employé");
                    return res.status(400).json({ message: "Employé non lié à une entreprise." });
                }
            }
            console.log("Utilisateur authentifié avec ID entreprise:", req.user); // Debug ici

            next(); // Passer au middleware suivant
        } catch (err) {
            console.error("❌ Erreur lors de la vérification du token:", err);
            return res.status(401).json({ message: 'Token invalide ou expiré' });
        }
    };
};

module.exports = authMiddleware;

