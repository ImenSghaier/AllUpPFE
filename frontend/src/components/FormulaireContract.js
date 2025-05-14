import React, { useState, useEffect } from "react";  
import { useDispatch } from "react-redux";
import { createContractAction } from "../redux/actions/contractAction";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import "./FormulaireContract.css";

const socket = io("http://localhost:4000");

const FormulaireContract = ({ contrat, onCancel, setActiveTab }) => {
  const dispatch = useDispatch();
  const [clause, setClause] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [signatureEntreprise, setSignatureEntreprise] = useState(true);
  const [idEntreprise, setIdEntreprise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken && decodedToken.id_entreprise) {
          setIdEntreprise(decodedToken.id_entreprise);
        } else {
          console.log("⚠️ id_entreprise non trouvé dans le token !");
        }
      } catch (error) {
        console.log("🚨 Erreur de décodage du token :", error);
      }
    } else {
      console.log("⚠️ Token non trouvé dans le localStorage.");
    }
    setLoading(false);
  }, []);

  if (!contrat) {
    return <p>Erreur : Données du contract manquantes.</p>;
  }

  const { id_offre, id_fournisseur } = contrat;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idEntreprise) {
      alert("Erreur : ID de l'entreprise manquant.");
      return;
    }

    const newContract = {
      id_offre,
      id_fournisseur,
      id_entreprise: idEntreprise,
      clause,
      date_debut: dateDebut,
      date_fin: dateFin,
      signature_entreprise: signatureEntreprise,
    };

    try {
      // Dispatch de l'action pour créer le contract
      await dispatch(createContractAction(newContract));

      // Notification via WebSocket
      socket.emit("newContract", { id_fournisseur, contract: newContract });

      // Confirmation visuelle
      alert("contract envoyé avec succès et notification envoyée au fournisseur !");

      // Retour automatique à l'onglet "offres"
      setActiveTab("offres");

      // Réinitialisation des champs du formulaire
      setClause("");
      setDateDebut("");
      setDateFin("");
      onCancel();

    } catch (error) {
      console.error("Erreur lors de l'envoi du contract:", error);
      alert("Erreur lors de l'envoi du contract. Veuillez réessayer.");
    }
  };

  return (
    <div className="formulaire-contract">
    <div className="contract-form-container">
      <h2>Créer un contract</h2>
      {loading && <p>Chargement...</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Clause :</label>
          <textarea
            value={clause}
            onChange={(e) => setClause(e.target.value)}
            placeholder="Ajoutez les clauses du contract..."
            required
          />
        </div>
        <div>
          <label>Date de début :</label>
          <input
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date de fin :</label>
          <input
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            required
          />
        </div>
        <div>         
          <label>Signature entreprise</label> 
            <input
              type="checkbox"
              checked={signatureEntreprise}
              onChange={(e) => setSignatureEntreprise(e.target.checked)}
              
              className="custom-checkbox"
            />
            
         
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading || !idEntreprise}>Envoyer</button>
          <button type="button" onClick={onCancel}>Annuler</button>
        </div>
        
      </form>
    </div>
    </div>
  );
};

export default FormulaireContract;
