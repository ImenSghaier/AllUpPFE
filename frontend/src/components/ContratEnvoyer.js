import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSentContractsAction } from "../redux/actions/contractAction";
import { jwtDecode } from "jwt-decode";
import './ContratEnvoyer.css'; // Assurez-vous d'importer le fichier CSS pour le style
// Icônes pour les statuts
import { FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Exemple d'icônes

const ContratEnvoyer = () => {
  const dispatch = useDispatch();

  // 🔓 Récupérer le token et décoder l'id_entreprise
  const token = localStorage.getItem("token");
  let id_entreprise = null;

  if (token) {
    const decoded = jwtDecode(token);
    id_entreprise = decoded.id_entreprise;
  }
  console.log("ID entreprise décodé :", id_entreprise);

  // 📥 Récupérer les contrats envoyés depuis Redux
  const sentContracts = useSelector((state) => state.contract.sentContracts || []);
  const loading = useSelector((state) => state.contract.loading);

  // 🛠 Pagination : état pour la page actuelle et les contrats par page
  const [currentPage, setCurrentPage] = useState(1);
  const [contractsPerPage] = useState(10); // Nombre de contrats par page
  const [statusFilter, setStatusFilter] = useState(""); // Filtre par statut

  // 🔄 Appel de l'action au chargement
  useEffect(() => {
    if (id_entreprise) {
      dispatch(getSentContractsAction(id_entreprise));
    }
  }, [dispatch, id_entreprise]);

  // 🔄 Filtrage des contrats par statut
  const filteredContracts = sentContracts.filter((contract) => {
    if (!statusFilter) return true;
    return contract.statut === statusFilter;
  });

  // 🧩 Calculer les contrats à afficher sur la page actuelle
  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = filteredContracts.slice(indexOfFirstContract, indexOfLastContract);

  // 🔄 Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 🔄 Changer de statut
  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset à la première page lors du changement de filtre
  };

  return (
    <div className="sent-contracts-container">
      <h2>📄 Contrats envoyés</h2>

      {loading ? (
        <p>Chargement des contrats...</p>
      ) : filteredContracts.length === 0 ? (
        <p>Aucun contrat envoyé pour le moment.</p>
      ) : (
        <>
          {/* Filtrage par statut sous forme d'icônes */}
          <div className="filter-container">
            <button onClick={() => handleStatusChange("EN_ATTENTE")} aria-label="En attente">
              <FaClock size={30} color={statusFilter === "EN_ATTENTE" ? "blue" : "gray"} />
            </button>
            <button onClick={() => handleStatusChange("ACTIF")} aria-label="Actif">
              <FaCheckCircle size={30} color={statusFilter === "ACTIF" ? "green" : "gray"} />
            </button>
            <button onClick={() => handleStatusChange("REFUSÉ")} aria-label="Refusé">
              <FaTimesCircle size={30} color={statusFilter === "REFUSÉ" ? "red" : "gray"} />
            </button>
          </div>

          {/* Tableau des contrats */}
          <table className="contracts-table">
  <thead>
    <tr>
      <th>Fournisseur</th>
      <th>Offre</th>
      <th>Date d'envoi</th>
      <th>Statut</th>
      <th>Clause</th>
      <th>Date début</th>
      <th>Date fin</th>
      <th>Signature Fournisseur</th>
      <th>Signature Entreprise</th>
    </tr>
  </thead>
  <tbody>
    {currentContracts.map((contrat) => (
      <tr key={contrat._id}>
        <td>{contrat.id_fournisseur?.nom || "Nom non disponible"}</td>
        <td>{contrat.id_offre?.titre || "Titre non disponible"}</td>
        <td>{new Date(contrat.date_creation).toLocaleDateString()}</td>
        <td>{contrat.statut}</td>
        <td>{contrat.clause || "Non spécifiée"}</td>
        <td>{contrat.date_debut ? new Date(contrat.date_debut).toLocaleDateString() : "Non spécifiée"}</td>
        <td>{contrat.date_fin ? new Date(contrat.date_fin).toLocaleDateString() : "Non spécifiée"}</td>
        <td>{contrat.signature_fournisseur ? "✔️" : "❌"}</td>
        <td>{contrat.signature_entreprise ? "✔️" : "❌"}</td>
      </tr>
    ))}
  </tbody>
</table>

          {/* Pagination */}
          <div className="pagination">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Précédent
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredContracts.length / contractsPerPage)}
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ContratEnvoyer;
