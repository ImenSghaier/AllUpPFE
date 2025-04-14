const express = require("express");
require("dotenv").config();
require("./configuration/connect");  
const http = require("http");
const socketIo = require("socket.io");

// Importation des routes et contrôleurs
const userRoute = require("./routes/utilisateur");  
const offreRoute = require("./routes/offre"); 
const reservationRoute = require("./routes/reservation");
const voteEmployeRoute = require("./routes/voteEmploye");
const entrepriseRoute = require("./routes/entreprise");
const DOERoute = require("./routes/demandeOffreEmploye");
const contractRoute = require("./routes/contractRoutes");
const contractController = require("./controllers/contractController");

const cors = require("cors");

const app = express();
app.use(express.json());

// Configuration CORS
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Serveur HTTP pour WebSocket
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

global.io = io; // Rendre io accessible globalement

// Configuration des WebSockets
io.on("connection", (socket) => {
  console.log("Nouvelle connexion WebSocket :", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId); // L'utilisateur rejoint son propre canal
    console.log(`Utilisateur ${userId} connecté au WebSocket`);
  });

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté du WebSocket");
  });
});

// Injecter io dans le controller des contrats
contractController.setSocketIo(io);

// Gestion des fichiers statiques
app.use("/uploads", express.static("./uploads"));

// Définition des routes
app.use("/offre", offreRoute);
app.use("/user", userRoute);  
app.use("/reservation", reservationRoute);
app.use("/voteEmploye", voteEmployeRoute);
app.use("/entreprise", entrepriseRoute);
app.use("/doe", DOERoute);
app.use("/contract", contractRoute);

// Lancement du serveur
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});





// const express = require('express');
// require('dotenv').config();
// require('./configuration/connect');
// const userRoute = require('./routes/utilisateur');
// const offreRoute = require('./routes/offre');
// const reservationRoute = require('./routes/reservation');
// const voteEmployeRoute = require('./routes/voteEmploye');
// const entrepriseRoute = require('./routes/entreprise');
// const DOERoute = require('./routes/demandeOffreEmploye');
// const contractRoute = require('./routes/contract');
// const cors = require('cors');
// const http = require('http');  // Importation du module HTTP
// const socketIo = require('socket.io'); // Importation de Socket.IO

// const app = express();
// const server = http.createServer(app); // Création du serveur HTTP

// // Configuration CORS
// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Middleware pour parser le JSON
// app.use(express.json());

// // Gestion des fichiers statiques
// app.use('/uploads', express.static('./uploads'));

// // Routes
// app.use('/offre', offreRoute);
// app.use('/user', userRoute);
// app.use('/reservation', reservationRoute);
// app.use('/voteEmploye', voteEmployeRoute);
// app.use('/entreprise', entrepriseRoute);
// app.use('/doe', DOERoute);
// app.use('/contract', contractRoute);

// // Initialisation de Socket.IO
// const io = socketIo(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"]
//     }
// });
// io.on("connection", (socket) => {
//     console.log("Un utilisateur connecté avec l'ID :", socket.id);

//     socket.on("envoyerContrat", ({ fournisseurId, contrat }) => {
//         console.log(`Contrat reçu pour le fournisseur ${fournisseurId}`, contrat);

//         // Envoyer à tous les fournisseurs (ou mieux : gérer les connexions par ID)
//         io.emit("recevoirContrat", contrat);
//     });

//     socket.on("disconnect", () => {
//         console.log("Un utilisateur s'est déconnecté");
//     });
// });

// // io.on("connection", (socket) => {
// //     console.log("Un utilisateur connecté");

// //     socket.on("envoyerContrat", ({ fournisseurId, contrat }) => {
// //         console.log(`Contrat reçu pour le fournisseur ${fournisseurId}`);

// //         // Envoyer le contrat au fournisseur concerné
// //         io.to(fournisseurId).emit("recevoirContrat", contrat);
// //     });

// //     socket.on("disconnect", () => {
// //         console.log("Un utilisateur s'est déconnecté");
// //     });
// // });

// // Démarrer le serveur sur le port 4000
// server.listen(4000, () => {
//     console.log('Serveur démarré sur le port 4000');
// });







// const express = require ('express');
// require('dotenv').config();
// require('./configuration/connect');  
// const userRoute = require('./routes/utilisateur');  
// const offreRoute = require('./routes/offre'); 
// const reservationRoute = require('./routes/reservation');
// const voteEmployeRoute = require('./routes/voteEmploye');
// const entrepriseRoute = require('./routes/entreprise');
// const DOERoute = require('./routes/demandeOffreEmploye');
// const contractRoute = require('./routes/contract');
// const cors = require('cors');
// const app = express();

// app.use(express.json());

// app.use(cors({
//     origin: "http://localhost:3000",  
//     credentials: true,  
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use('/uploads', express.static('./uploads'));

// app.use('/offre', offreRoute);
// app.use('/user', userRoute);  
// app.use('/reservation', reservationRoute);
// app.use('/voteEmploye', voteEmployeRoute);
// app.use('/entreprise', entrepriseRoute);
// app.use('/doe', DOERoute);
// app.use('/contract', contractRoute);



// app.listen(4000, () => {
//     console.log('Serveur démarré sur le port 4000');
// });

