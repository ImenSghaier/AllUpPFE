import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReceivedContractsAction, validateContractAction, signContractAction } from "../redux/actions/contractAction";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import "./ContratsRecusComponent.css";

// Import des icônes (vous pouvez utiliser react-icons ou votre propre bibliothèque d'icônes)
import { 
  FiInbox, FiSearch, FiCalendar, FiFileText, FiCheckCircle, 
  FiXCircle, FiClock, FiZap, FiChevronRight, FiChevronLeft,
  FiCheck, FiX, FiEdit2, FiRefreshCw, FiAlertTriangle
} from 'react-icons/fi';
import { FaBuilding, FaFileSignature, FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';

const socket = io("http://localhost:4000");

const ContratsRecusComponent = () => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("TOUS");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [contractsPerPage] = useState(10);

  const contratsRecus = useSelector((state) =>
    Array.isArray(state.contract.receivedContracts) ? state.contract.receivedContracts : []
  ) || [];

  const fetchContracts = useCallback(() => {
    if (userId) {
      dispatch(getReceivedContractsAction(userId));
    }
  }, [dispatch, userId]);

  const formatDateFr = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const fournisseurId = decodedToken._id;
      setUserId(fournisseurId);
      fetchContracts();

      socket.on("recevoirContrat", (data) => {
        if (data?.id_fournisseur === fournisseurId) {
          fetchContracts();
        }
      });

      socket.on("contratSigne", (data) => {
        if (data?.id_fournisseur === fournisseurId) {
          fetchContracts();
        }
      });
    }

    return () => {
      socket.off("recevoirContrat");
      socket.off("contratSigne");
    };
  }, [dispatch, fetchContracts]);

  const showMessage = (text, isSuccess = true) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleValiderContrat = async (id) => {
    try {
      await dispatch(validateContractAction(id, "ACTIF"));
      await fetchContracts();
      showMessage("Contrat validé avec succès !");
    } catch (error) {
      showMessage("Une erreur s'est produite lors de la validation.", false);
      console.error(error);
    }
  };

  const handleRefuserContrat = async (id) => {
    try {
      await dispatch(validateContractAction(id, "REFUSÉ"));
      await fetchContracts();
      showMessage("Contrat refusé avec succès.");
    } catch (error) {
      showMessage("Une erreur s'est produite lors du refus.", false);
      console.error(error);
    }
  };

  const handleSignerContrat = async (id) => {
    try {
      await dispatch(signContractAction(id));
      await fetchContracts();
      showMessage("Contrat signé avec succès !");
    } catch (error) {
      showMessage("Erreur lors de la signature du contrat.", false);
      console.error(error);
    }
  };

  const filteredContrats = contratsRecus
    .filter((contrat) => {
      if (filtreStatut === "TOUS") return true;
      return contrat.statut?.toUpperCase() === filtreStatut;
    })
    .filter((contrat) => {
      const entreprise = contrat.id_entreprise?.nom?.toLowerCase() || "";
      const offre = contrat.id_offre?.titre?.toLowerCase() || "";
      return entreprise.includes(searchTerm.toLowerCase()) || offre.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => new Date(b.date_debut) - new Date(a.date_debut));

  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = filteredContrats.slice(indexOfFirstContract, indexOfLastContract);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderStatusBadge = (statut) => {
    const status = statut?.toUpperCase().trim();
    
    switch (status) {
      case "ACTIF":
        return (
          <span className="status-badge status-actif">
            <FiCheckCircle className="icon" /> Validé
          </span>
        );
      case "REFUSÉ":
        return (
          <span className="status-badge status-refuse">
            <FiXCircle className="icon" /> Refusé
          </span>
        );
      case "EXPIRÉ":
        return (
          <span className="status-badge status-expire">
            <FiAlertTriangle className="icon" /> Expiré
          </span>
        );
      default:
        return (
          <span className="status-badge status-en_attente">
            <FiClock className="icon" /> En Attente
          </span>
        );
    }
  };

  return (
    <div className="contrats-recus-container">
      <h2><FiInbox className="icon" /> Contrats Reçus</h2>

      {message && <p className="message">{message}</p>}
      
      <div className="menu">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par entreprise ou offre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filtrage-statuts">
          {["TOUS", "EN_ATTENTE", "ACTIF", "REFUSÉ", "EXPIRÉ"].map((statut) => (
            <button
              key={statut}
              onClick={() => setFiltreStatut(statut)}
              className={filtreStatut === statut ? "active" : ""}
            >
              {statut === "TOUS" ? <FiRefreshCw className="icon" /> :
               statut === "EN_ATTENTE" ? <FiClock className="icon" /> :
               statut === "ACTIF" ? <FiCheckCircle className="icon" /> :
               statut === "REFUSÉ" ? <FiXCircle className="icon" /> : 
               <FiAlertTriangle className="icon" />}
              {statut}
            </button>
          ))}
        </div>
      </div>

      {currentContracts.length === 0 ? (
        <div className="empty-state">
          <FiInbox size={48} />
          <h3>Aucun contrat à afficher</h3>
          <p>Vous n'avez aucun contrat correspondant à vos critères de recherche.</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="contrats-table">
              <thead>
                <tr>
                  <th><FaBuilding className="icon" /> Entreprise</th>
                  <th><FiFileText className="icon" /> Offre</th>
                  <th><FiFileText className="icon" /> Clause</th>
                  <th><FiCalendar className="icon" /> Début</th>
                  <th><FiCalendar className="icon" /> Fin</th>
                  <th><FaFileSignature className="icon" /> Entreprise</th>
                  <th><FaFileSignature className="icon" /> Fournisseur</th>
                  <th><FiZap className="icon" /> Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentContracts.map((contrat) => (
                  <tr key={contrat._id}>
                    <td>{contrat.id_entreprise.nom}</td>
                    <td>{contrat.id_offre.titre}</td>
                    <td>{contrat.clause}</td>
                    <td>{formatDateFr(contrat.date_debut)}</td>
                    <td>{formatDateFr(contrat.date_fin)}</td>
                    <td>
                      {contrat.signature_entreprise ? 
                        <FaRegCheckCircle color="#28a745" size={20} /> : 
                        <FaRegTimesCircle color="#dc3545" size={20} />}
                    </td>
                    <td>
                      {contrat.signature_fournisseur ? 
                        <FaRegCheckCircle color="#28a745" size={20} /> : 
                        <FaRegTimesCircle color="#dc3545" size={20} />}
                    </td>
                    <td>
                      {renderStatusBadge(contrat.statut)}
                    </td>
                    <td>
                      {contrat.statut?.toUpperCase().trim() === "EN_ATTENTE" && (
                        <div className="action-buttons">
                          <button className="btn-validate" onClick={() => handleValiderContrat(contrat._id)}>
                            <FiCheck className="icon" /> Valider
                          </button>
                          <button className="btn-refuse" onClick={() => handleRefuserContrat(contrat._id)}>
                            <FiX className="icon" /> Refuser
                          </button>
                        </div>
                      )}
                      {contrat.statut?.toUpperCase().trim() === "ACTIF" && !contrat.signature_fournisseur && (
                        <button className="btn-sign" onClick={() => handleSignerContrat(contrat._id)}>
                          <FiEdit2 className="icon" /> Signer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            {currentPage > 1 && (
              <button onClick={() => handlePageChange(currentPage - 1)}>
                <FiChevronLeft className="icon" /> Précédent
              </button>
            )}
            
            {Array.from({ length: Math.ceil(filteredContrats.length / contractsPerPage) }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
            
            {currentPage < Math.ceil(filteredContrats.length / contractsPerPage) && (
              <button onClick={() => handlePageChange(currentPage + 1)}>
                Suivant <FiChevronRight className="icon" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ContratsRecusComponent;