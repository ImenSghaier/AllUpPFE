import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/actions/authAction";
import { Link } from "react-router-dom";
import logo from '../pages/logo-all-up.png'; // Assurez-vous que le chemin est correct
import "./ForgotPasswordComponent.css"; // Assurez-vous que le chemin est correct
const ForgotPasswordComponent = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const { message, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div className="forgot-password-page">
    <div className="forgot-password-container">
  <img src={logo} alt="Logo" className="forgot-password-logo" />

  <h2 className="forgot-password-title">Recupération du mot de passe</h2>

  <form onSubmit={handleSubmit}>
    <input
      type="email"
      placeholder="Entrez votre email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      className="forgot-password-input"
    />
    <button type="submit" className="forgot-password-button">
      Envoyer
    </button>
  </form>

  {message && <div className="success-message">{message}</div>}
  {error && <div className="error-message">{error}</div>}

  <Link to="/login" className="return-login">
    Retour à la connexion
  </Link>
</div>
</div>
  );
};

export default ForgotPasswordComponent;
