import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReceivedContractsAction, validateContractAction, signContractAction } from "../redux/actions/contractAction";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import "./ContratsRecusComponent.css";

const socket = io("http://localhost:4000");

const ContratsRecusComponent = () => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("TOUS");
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

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => {
      setMessage("");
    }, 5000); // 5 secondes
  };

  const handleValiderContrat = async (id) => {
    try {
      await dispatch(validateContractAction(id, "ACTIF"));
      await fetchContracts();
      showMessage("✅ Contrat validé !");
    } catch (error) {
      showMessage("❌ Une erreur s'est produite lors de la validation.");
      console.error(error);
    }
  };

  const handleRefuserContrat = async (id) => {
    try {
      await dispatch(validateContractAction(id, "REFUSÉ"));
      await fetchContracts();
      showMessage("❌ Contrat refusé !");
    } catch (error) {
      showMessage("❌ Une erreur s'est produite lors du refus.");
      console.error(error);
    }
  };

  const handleSignerContrat = async (id) => {
    try {
      await dispatch(signContractAction(id));
      await fetchContracts();
      showMessage("✍️ Contrat signé avec succès !");
    } catch (error) {
      showMessage("❌ Erreur lors de la signature du contrat.");
      console.error(error);
    }
  };

  const filteredContrats = contratsRecus.filter((contrat) => {
    if (filtreStatut === "TOUS") return true;
    return contrat.statut?.toUpperCase() === filtreStatut;
  });

  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = filteredContrats.slice(indexOfFirstContract, indexOfLastContract);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  console.log("Contrats reçus :", contratsRecus); // Debug: voir les contrats reçus 
  return (
    <div className="contrats-recus-container">
      <h2>📩 Contrats Reçus</h2>

      {message && <p className="message">{message}</p>}

      <div className="filtrage-statuts">
        <button onClick={() => setFiltreStatut("TOUS")} className={filtreStatut === "TOUS" ? "active" : ""}>🔄 <br/>Tous</button>
        <button onClick={() => setFiltreStatut("EN_ATTENTE")} className={filtreStatut === "EN_ATTENTE" ? "active" : ""}>🕐 <br/>En Attente</button>
        <button onClick={() => setFiltreStatut("ACTIF")} className={filtreStatut === "ACTIF" ? "active" : ""}>✅ <br/>Validé</button>
        <button onClick={() => setFiltreStatut("REFUSÉ")} className={filtreStatut === "REFUSÉ" ? "active" : ""}>❌ <br/>Refusé</button>
      </div>

      {currentContracts.length === 0 ? (
        <p>Aucun contrat à afficher.</p>
      ) : (
        <table className="contrats-table">
          <thead>
            <tr>
              <th>Entreprise</th>
              <th>Offre</th>
              <th>📄 Clause</th>
              <th>📅 Début</th>
              <th>📅 Fin</th>
               <th>✅ Signature <br/>Entreprise</th>
              <th>✅ Signature <br/>Fournisseur</th>
              <th>🛑 Statut</th>
              <th>🎯 Action</th>
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
                <td>{contrat.signature_entreprise ? "🟢" : "🔴"}</td>
                <td>{contrat.signature_fournisseur ? "🟢" : "🔴"}</td>

                <td>
                  {(() => {
                    const statut = contrat.statut?.toUpperCase().trim();
                    switch (statut) {
                      case "ACTIF":
                        return "✅ Validé";
                      case "REFUSÉ":
                        return "❌ Refusé";
                      default:
                        return "🕐 En Attente";
                    }
                  })()}
                </td>
                <td>
                  {contrat.statut?.toUpperCase().trim() === "EN_ATTENTE" && (
                    <>
                      <button className="btn-validate" onClick={() => handleValiderContrat(contrat._id)}>Valider</button>
                      <button className="btn-refuse" onClick={() => handleRefuserContrat(contrat._id)}>Refuser</button>
                    </>
                  )}
                  {contrat.statut?.toUpperCase().trim() === "ACTIF" && !contrat.signature_fournisseur && (
                    <button className="btn-sign" onClick={() => handleSignerContrat(contrat._id)}>Signer</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredContrats.length / contractsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContratsRecusComponent;

