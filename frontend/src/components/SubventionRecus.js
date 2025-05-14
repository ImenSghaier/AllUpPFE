import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDemandesAdmin,
  updateDemandeStatut,
} from "../redux/actions/demandeAction";
import "./SubventionRecus.css";

// Import des icônes
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

const SubventionRecus = ({ setActiveTab }) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Nombre d'éléments par page

  const { loading, demandes, error } = useSelector((state) => state.demande);

  useEffect(() => {
    dispatch(fetchDemandesAdmin());
  }, [dispatch]);

  // Fonction pour filtrer les demandes en fonction du statut
  const filteredDemandes = demandes.filter((demande) => {
    if (filter === "ALL") return true;
    return demande.statut === filter;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDemandes.slice(indexOfFirstItem, indexOfLastItem);

  const handleStatutChange = (id, statut) => {
    dispatch(updateDemandeStatut(id, statut));

    if (statut === "APPROUVÉE") {
      setActiveTab("offres");
    }
  };

  // Change de page
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="subvention-container">
      <h2>Demandes de Subvention Reçues</h2>

      {/* Filtrage par statut */}
      <div className="filter-container">
        <button
          className={`filter-btn ${filter === "ALL" ? "active" : ""}`}
          onClick={() => setFilter("ALL")}
        >
          Tout
        </button>
        <button
          className={`filter-btn ${filter === "EN_ATTENTE" ? "active" : ""}`}
          onClick={() => setFilter("EN_ATTENTE")}
        >
          <FaSpinner />
          En Attente
        </button>
        <button
          className={`filter-btn ${filter === "APPROUVÉE" ? "active" : ""}`}
          onClick={() => setFilter("APPROUVÉE")}
        >
          <FaCheckCircle />
          Approuvée
        </button>
        <button
          className={`filter-btn ${filter === "REJETÉE" ? "active" : ""}`}
          onClick={() => setFilter("REJETÉE")}
        >
          <FaTimesCircle />
          Rejetée
        </button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : filteredDemandes.length === 0 ? (
        <p>Aucune demande trouvée.</p>
      ) : (
        <table className="subvention-table">
          <thead>
            <tr>
              <th>Employé</th>
              <th>Contenu</th>
              <th>Offre</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((demande) => (
              <tr key={demande._id}>
                <td>{demande.id_employe?.nom || "invalide"}</td>
                <td>{demande.contenue || "invalide"}</td>
                <td>{demande.id_offre?.titre || "invalide"}</td>
                <td>{demande.id_offre?.type || "invalide"}</td>
                <td className={`statut ${demande.statut.toLowerCase()}`}>
                  {demande.statut}
                </td>
                <td>
                  {demande.statut === "EN_ATTENTE" ? (
                    <>
                      <button
                        className="btn approve"
                        onClick={() =>
                          handleStatutChange(demande._id, "APPROUVÉE")
                        }
                      >
                        Approuver
                      </button>
                      <button
                        className="btn reject"
                        onClick={() =>
                          handleStatutChange(demande._id, "REJETÉE")
                        }
                      >
                        Rejeter
                      </button>
                    </>
                  ) : (
                    <span></span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(filteredDemandes.length / itemsPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              className={`page-btn ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default SubventionRecus;
