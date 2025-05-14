const express = require("express");
require("dotenv").config();
require("./configuration/connect");
const http = require("http");
const socketIo = require("socket.io");

// Importation des routes et contrôleurs
const userRoute = require("./routes/utilisateur");
const offreRoute = require("./routes/offre");
const reservationRoute = require("./routes/reservationRoutes");
const voteEmployeRoute = require("./routes/voteEmploye");
const entrepriseRoute = require("./routes/entreprise");
const DOERoute = require("./routes/demandeRoutes");
const contractRoute = require("./routes/contractRoutes");
const contractController = require("./controllers/contractController");
const statsRouter = require('./routes/stats');

// Schémas Mongoose
const Utilisateur = require('./models/utilisateur');
const Offre = require('./models/offre');
const Contract = require('./models/contract');

const cors = require("cors");

const app = express();

// Middleware pour le parsing JSON
app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

// Configuration CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Création du serveur HTTP
const server = http.createServer(app);

// Configuration Socket.io
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

global.io = io; // rendre io accessible globalement

// Middleware pour injecter io dans req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Configuration des événements Socket.io
io.on("connection", (socket) => {
  console.log("✅ Nouvelle connexion WebSocket :", socket.id);

  // Envoi périodique des stats (toutes les 5 secondes)
  const interval = setInterval(async () => {
    const stats = await getLiveStats();
    socket.emit('statsUpdate', stats);
  }, 5000);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`ℹ️ Utilisateur ${userId} a rejoint son canal WebSocket`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Utilisateur déconnecté du WebSocket");
    clearInterval(interval);
  });
});

// Fonction pour les stats en direct
async function getLiveStats() {
  try {
    const userCount = await Utilisateur.countDocuments();
    const offerCount = await Offre.countDocuments();
    const conventionCount = await Contract.countDocuments();
    const recentUsers = await Utilisateur.find().sort({ createdAt: -1 }).limit(5);
    
    return {
      users: userCount,
      offers: offerCount,
      conventions: conventionCount,
      recentUsers,
      timestamp: new Date()
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des stats:", error);
    return {
      error: "Erreur lors de la récupération des statistiques"
    };
  }
}

// Injecter io dans le contrôleur des contrats
contractController.setSocketIo(io);

// Fichiers statiques
app.use("/uploads", express.static("./uploads"));

// Routes
app.use("/offre", offreRoute);
app.use("/user", userRoute);
app.use("/reservation", reservationRoute);
app.use("/voteEmploye", voteEmployeRoute);

app.use("/entreprise", entrepriseRoute);
app.use("/demande", DOERoute);
app.use("/contract", contractRoute);
app.use('/api/stats', statsRouter);

// Lancement du serveur
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

// const express = require("express");
// require("dotenv").config();
// require("./configuration/connect");
// const http = require("http");
// const socketIo = require("socket.io");



// // Importation des routes et contrôleurs
// const userRoute = require("./routes/utilisateur");
// const offreRoute = require("./routes/offre");
// const reservationRoute = require("./routes/reservationRoutes");
// const voteEmployeRoute = require("./routes/voteEmploye");
// const entrepriseRoute = require("./routes/entreprise");
// const DOERoute = require("./routes/demandeRoutes");
// const contractRoute = require("./routes/contractRoutes");
// const contractController = require("./controllers/contractController");

// const cors = require("cors");

// const app = express();

// // ✅ Remplace express.json() par ce bloc pour éviter l’erreur sur les requêtes GET
// app.use((req, res, next) => {
//   if (["POST", "PUT", "PATCH"].includes(req.method)) {
//     express.json()(req, res, next);
//   } else {
//     next();
//   }
// });

// // Middleware pour injecter io dans req
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // Configuration CORS
// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// // Création du serveur HTTP et WebSocket
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: "*",
//   },
// });

// global.io = io; // rendre io accessible globalement

// // Configuration WebSocket
// io.on("connection", (socket) => {
//   console.log("✅ Nouvelle connexion WebSocket :", socket.id);

//   socket.on("join", (userId) => {
//     socket.join(userId);
//     console.log(`ℹ️ Utilisateur ${userId} a rejoint son canal WebSocket`);
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ Utilisateur déconnecté du WebSocket");
//   });
// });

// // Injecter io dans le contrôleur des contrats
// contractController.setSocketIo(io);

// // Fichiers statiques
// app.use("/uploads", express.static("./uploads"));

// // Routes
// app.use("/offre", offreRoute);
// app.use("/user", userRoute);
// app.use("/reservation", reservationRoute);
// app.use("/voteEmploye", voteEmployeRoute);
// app.use("/entreprise", entrepriseRoute);
// app.use("/demande", DOERoute);
// app.use("/contract", contractRoute);

// // Lancement du serveur
// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => {
//   console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
// });
