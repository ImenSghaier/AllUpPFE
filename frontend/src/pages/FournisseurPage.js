import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";  // Importation de socket.io-client
import { FaBox, FaFileAlt, FaSignOutAlt } from "react-icons/fa";
import { logout } from "../redux/actions/authAction";
import { useDispatch } from "react-redux";
import "./FournisseurDashboard.css";
import OffreComponent from "../components/OffreComponent";
import ContractsRecusComponent from "../components/ContractsRecusComponent";
import logo from './logo-all-up.png'; 
import TopBar from "../components/TopBar";

// Connexion au serveur WebSocket
const socket = io("http://localhost:4000"); 

const FournisseurPage = () => {
  const [activeTab, setActiveTab] = useState("offres");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);

  // Gestion des notifications via WebSocket
  useEffect(() => {
    socket.on("recevoirContrat", (contrat) => {
      setNotifications((prev) => [...prev, contrat]);
    });

    return () => socket.off("recevoirContrat");
  }, []);

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="fournisseur-container">
      {/* Barre de navigation en haut (top bar) */}
     

      {/* Barre latérale */}
      <div className="sidebar">
        <img src={logo} alt="logo" className="logo" />
        <h2 className="sidebar-title">ALL UP</h2>

        <nav className="nav-menu">
          <button
            className={`nav-button ${activeTab === "offres" ? "active" : ""}`}
            onClick={() => setActiveTab("offres")}
          >
            <FaBox className="icon" />
            Offres
          </button>
          <button
            className={`nav-button ${activeTab === "contrats" ? "active" : ""}`}
            onClick={() => setActiveTab("contrats")}
          >
            <FaFileAlt className="icon" />
            Contrats Recus
          </button>
        </nav>

        {/* Bouton Se Déconnecter */}
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="icon" />
          Se déconnecter
        </button>
      </div>

      {/* Contenu principal */}
      <div className="content">
 
      <TopBar content="Espace Fournisseur" /> {/* Utilisation de la barre de navigation personnalisée */}
        <div className="content-box">
          {activeTab === "offres" && <OffreComponent />}
          {activeTab === "contrats" && <ContractsRecusComponent />}
        </div>
      </div>
    </div>
  );
};

export default FournisseurPage;


