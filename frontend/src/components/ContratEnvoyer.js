import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSentContractsAction } from "../redux/actions/contractAction";
import { jwtDecode } from "jwt-decode";
import './ContratEnvoyer.css';
import { 
  FaClock, 
  FaCheckCircle, 
  FaFileContract,
  FaTimesCircle, 
  FaFolderOpen, 
  FaHourglassEnd,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaFilter
} from "react-icons/fa";
import { Tooltip } from 'react-tooltip';
import ContractModal from "./ContractModal";

const ContratEnvoyer = () => {
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  let id_entreprise = null;
  if (token) {
    const decoded = jwtDecode(token);
    id_entreprise = decoded.id_entreprise;
  }

  const sentContracts = useSelector((state) => state.contract.sentContracts || []);
  const loading = useSelector((state) => state.contract.loading);
  const [selectedContract, setSelectedContract] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contractsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (id_entreprise) {
      dispatch(getSentContractsAction(id_entreprise));
    }
  }, [dispatch, id_entreprise]);

  // Filtres et recherche
  const filteredContracts = sentContracts.filter((contract) => {
    // Filtre par statut
    if (statusFilter === "EXPIRÉ") {
      const now = new Date();
      if (!contract.date_fin) return false;
      return new Date(contract.date_fin) < now;
    } else if (statusFilter && contract.statut !== statusFilter) {
      return false;
    }

    // Filtre de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        (contract.id_fournisseur?.nom?.toLowerCase().includes(term)) ||
        (contract.id_offre?.titre?.toLowerCase().includes(term)) ||
        (contract.clause?.toLowerCase().includes(term))
      );
    }

    return true;
  });

  // Pagination
  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = filteredContracts.slice(indexOfFirstContract, indexOfLastContract);
  const totalPages = Math.ceil(filteredContracts.length / contractsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Options de statut pour le dropdown mobile
  const statusOptions = [
    { value: "", label: "Tous", icon: <FaFolderOpen />, color: "#171F5D" },
    { value: "EN_ATTENTE", label: "En attente", icon: <FaClock />, color: "#FFAA00" },
    { value: "ACTIF", label: "Actif", icon: <FaCheckCircle />, color: "green" },
    { value: "REFUSÉ", label: "Refusé", icon: <FaTimesCircle />, color: "red" },
    { value: "EXPIRÉ", label: "Expiré", icon: <FaHourglassEnd />, color: "orange" }
  ];

  return (
    <div className="sent-contracts-container">
      <header className="contracts-header">
        <h2>
          <FaFileContract className="contract-icon" /> 
          Contrats envoyés
          <span className="badge">{sentContracts.length}</span>
        </h2>
        
        <div className="search-filter-container">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un contrat..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          <div className="mobile-filter">
            <FaFilter />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des contrats...</p>
        </div>
      ) : (
        <>
          {/* Filtres desktop */}
          <div className="filter-container">
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={statusFilter === option.value ? "active" : ""}
                data-tooltip-id="filter-tooltip"
                data-tooltip-content={option.label}
                style={{ color: statusFilter === option.value ? option.color : "#171F5D" }}
              >
                {option.icon}
                <span className="filter-label">{option.label}</span>
              </button>
            ))}
            <Tooltip id="filter-tooltip" place="bottom" effect="solid" />
          </div>

          {/* Gestion des cas vides */}
          {sentContracts.length === 0 ? (
            <div className="empty-state">
              <img src="/images/empty-contracts.svg" alt="Aucun contrat" />
              <h3>Aucun contrat envoyé pour le moment</h3>
              <p>Lorsque vous enverrez des contrats à vos fournisseurs, ils apparaîtront ici.</p>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="empty-state">
              <img src="/images/no-results.svg" alt="Aucun résultat" />
              <h3>Aucun résultat trouvé</h3>
              <p>Aucun contrat ne correspond à vos critères de recherche.</p>
              <button 
                onClick={() => {
                  setStatusFilter("");
                  setSearchTerm("");
                }}
                className="reset-filters"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              {/* Tableau des contrats */}
              <div className="table-responsive">
                <table className="contracts-table">
                  <thead>
                    <tr>
                      <th>Fournisseur</th>
                      <th>Offre</th>
                      <th>Date d'envoi</th>
                      <th>Statut</th>
                      <th>Clause</th>
                      <th>Période</th>
                      <th>Signatures</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentContracts.map((contrat) => {
                      const isExpired = contrat.date_fin && new Date(contrat.date_fin) < new Date();
                      const status = isExpired ? "EXPIRÉ" : contrat.statut;
                      
                      return (
                        <tr key={contrat._id}>
                          <td>
                            <div className="supplier-info">
                              <div className="supplier-avatar">
                                {contrat.id_fournisseur?.nom?.charAt(0) || "F"}
                              </div>
                              <span>{contrat.id_fournisseur?.nom || "Non disponible"}</span>
                              
                            </div>
                          </td>
                          <td>
                            <div className="offer-title">
                              {contrat.id_offre?.titre || "Titre non disponible"}
                            </div>
                          </td>
                          <td>
                            {new Date(contrat.date_creation).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td>
                            <span className={`status-badge status-${status.toLowerCase().replace('é', 'e')}`}>
                              {status === "EN_ATTENTE" && <FaClock />}
                              {status === "ACTIF" && <FaCheckCircle />}
                              {status === "REFUSÉ" && <FaTimesCircle />}
                              {status === "EXPIRÉ" && <FaHourglassEnd />}
                              {status}
                            </span>
                          </td>
                          <td>
                            <div className="clause-text" title={contrat.clause}>
                              {contrat.clause ? (
                                contrat.clause.length > 30 ? 
                                `${contrat.clause.substring(0, 30)}...` : 
                                contrat.clause
                              ) : "Non spécifiée"}
                            </div>
                          </td>
                          <td>
                            <div className="date-range">
                              <div>
                                <span className="date-label">Début:</span> 
                                {contrat.date_debut ? 
                                  new Date(contrat.date_debut).toLocaleDateString('fr-FR') : 
                                  "Non spécifiée"}
                              </div>
                              <div>
                                <span className="date-label">Fin:</span> 
                                {contrat.date_fin ? 
                                  new Date(contrat.date_fin).toLocaleDateString('fr-FR') : 
                                  "Non spécifiée"}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="signatures">
                              <span className={contrat.signature_fournisseur ? "signed" : "not-signed"}>
                                Fourn. {contrat.signature_fournisseur ? "✔️" : "❌"}
                              </span>
                              <span className={contrat.signature_entreprise ? "signed" : "not-signed"}>
                                Entr. {contrat.signature_entreprise ? "✔️" : "❌"}
                              </span>
                            </div>
                          </td>
                          <td>
                          <button 
                            className="action-button view-button"
                            onClick={() => setSelectedContract(contrat)}
                          >
                            Voir
                          </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="pagination-container">
                <div className="pagination-info">
                  Affichage {indexOfFirstContract + 1}-{Math.min(indexOfLastContract, filteredContracts.length)} sur {filteredContracts.length} contrats
                </div>
                
                <div className="pagination-controls">
                  <button 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    <FaChevronLeft />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`pagination-button ${currentPage === pageNum ? "active" : ""}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="pagination-ellipsis">...</span>
                  )}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button
                      onClick={() => paginate(totalPages)}
                      className={`pagination-button ${currentPage === totalPages ? "active" : ""}`}
                    >
                      {totalPages}
                    </button>
                  )}
                  
                  <button 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
      {selectedContract && (
  <ContractModal
    contract={selectedContract} 
    onClose={() => setSelectedContract(null)} 
  />
)}
    </div>
  );
};

export default ContratEnvoyer;