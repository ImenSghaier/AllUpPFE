import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EntrepriseComponent from "../components/entrepriseComponent";
import { FaBuilding,  FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import { logout } from "../redux/actions/authAction"; 
import { useDispatch } from "react-redux";  
import "./AdminPage.css"; // Fichier CSS
import CreateUserForm from "../components/CreateUserForm";
import logo from './logo-all-up.png'; 
const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("entreprises");
  const navigate = useNavigate();
  const dispatch = useDispatch();  // Utiliser dispatch

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    dispatch(logout()); // Appeler l'action de déconnexion
    navigate("/login"); // Redirection vers la page de connexion
  };

  return (
    <div className="admin-container">
      {/* Barre de navigation en haut (top bar) */}
      <div className="topbar">
        <h1>Dashboard Administrateur</h1>
      </div>

      {/* Barre latérale */}
      <div className="sidebar">
        <img src={logo} alt="logo" className="logo" />
        <h2 className="sidebar-title">ALL UP</h2>
    
        <nav className="nav-menu">
          <button
            className={`nav-button ${activeTab === "entreprises" ? "active" : ""}`}
            onClick={() => setActiveTab("entreprises")}
          >
            <FaBuilding className="icon" />
            Entreprises
          </button>
          <button
            className={`nav-button ${activeTab === "create-user" ? "active" : ""}`}
            onClick={() => setActiveTab("create-user")}
          >
            <FaUserPlus className="icon" />
            Utilisateurs
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
        <div className="content-box">
          {activeTab === "entreprises" && <EntrepriseComponent />}
          {activeTab === "create-user" && <CreateUserForm />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
