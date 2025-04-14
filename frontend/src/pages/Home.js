import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import logo from './logo-all-up.png'; 

function Home() {
  return (
    <div className="home-container">
      <div className="glass-card">
        <h1 className="welcome-text">Bienvenue sur <span>ALL UP</span></h1>
        <img src={logo} alt="logo" className="logo" />
        {/* <p className="description">Une plateforme innovante pour vos besoins en entreprises et services.</p> */}
        <Link to="/login">
          <button className="btn-connect">Se Connecter</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
