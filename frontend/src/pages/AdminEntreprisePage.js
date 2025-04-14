import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeComponent from "../components/EmployeComponent";
import OffreAdminComponent from "../components/offreAdminComponent";
import FormulaireContrat from "../components/FormulaireContract";
import ContratEnvoyer from "../components/ContratEnvoyer"; // ✅ NOUVEAU IMPORT
import { FaUserTie, FaSignOutAlt, FaTags ,FaFileContract  } from "react-icons/fa";
import { logout } from "../redux/actions/authAction";
import { useDispatch } from "react-redux";
import "./AdminEntreprisePage.css";

import logo from "./logo-all-up.png";

const AdminEntreprisePage = () => {
  const [activeTab, setActiveTab] = useState("employes");
  const [selectedContrat, setSelectedContrat] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleReserverClick = (contrat) => {
    setSelectedContrat(contrat);
  };

  const handleSubmitContrat = (contratData) => {
    console.log("Contrat soumis :", contratData);
    // Ajouter ici l'envoi du contrat au backend via une requête API
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="admin-entreprise-container">
      <div className="topbar">
        <h1>Dashboard AdminEntreprise</h1>
      </div>
      <div className="sidebar">
        <img src={logo} alt="logo" className="logo" />
        <h2 className="sidebar-title">ALL UP</h2>
        <nav className="nav-menu">
          <button
            className={`nav-button ${activeTab === "employes" ? "active" : ""}`}
            onClick={() => setActiveTab("employes")}
          >
            <FaUserTie className="icon" /> Employés
          </button>
          <button
            className={`nav-button ${activeTab === "offres" ? "active" : ""}`}
            onClick={() => setActiveTab("offres")}
          >
            <FaTags className="icon" /> Offres
          </button>
          <button
            className={`nav-button ${activeTab === "contrats" ? "active" : ""}`}
            onClick={() => setActiveTab("contrats")}
          >
            <FaFileContract className="icon" /> Contrats Envoyés
          </button>

        </nav>
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="icon" /> Se déconnecter
        </button>
      </div>
      <div className="content">
        <div className="content-box">
          {selectedContrat ? (
            <FormulaireContrat
              contrat={selectedContrat}
              onSubmit={handleSubmitContrat}
              onCancel={() => setSelectedContrat(null)}
              setActiveTab={setActiveTab}
            />
          ) : activeTab === "employes" ? (
            <EmployeComponent />
          ) : activeTab === "offres" ? (
            <OffreAdminComponent onReserverClick={handleReserverClick} />
          ) : activeTab === "contrats" ? (
            <ContratEnvoyer />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminEntreprisePage;




// // AdminEntreprisePage.js 
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import EmployeComponent from "../components/EmployeComponent";
// import OffreAdminComponent from "../components/offreAdminComponent";
// import FormulaireContrat from "../components/FormulaireContract";
// import { FaUserTie, FaSignOutAlt, FaTags } from "react-icons/fa";
// import { logout } from "../redux/actions/authAction";
// import { useDispatch } from "react-redux";
// import "./AdminEntreprisePage.css";

// import logo from "./logo-all-up.png";

// const AdminEntreprisePage = () => {
//   const [activeTab, setActiveTab] = useState("employes");
//   const [selectedContrat, setSelectedContrat] = useState(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleReserverClick = (contrat) => {
//     setSelectedContrat(contrat);
//   };

//   const handleSubmitContrat = (contratData) => {
//     console.log("Contrat soumis :", contratData);
//     // Ajouter ici l'envoi du contrat au backend via une requête API
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };

//   return (
//     <div className="admin-entreprise-container">
//       <div className="topbar">
//         <h1>Dashboard AdminEntreprise</h1>
//       </div>
//       <div className="sidebar">
//         <img src={logo} alt="logo" className="logo" />
//         <h2 className="sidebar-title">ALL UP</h2>
//         <nav className="nav-menu">
//           <button
//             className={`nav-button ${activeTab === "employes" ? "active" : ""}`}
//             onClick={() => setActiveTab("employes")}
//           >
//             <FaUserTie className="icon" /> Employés
//           </button>
//           <button
//             className={`nav-button ${activeTab === "offres" ? "active" : ""}`}
//             onClick={() => setActiveTab("offres")}
//           >
//             <FaTags className="icon" /> Offres
//           </button>
//         </nav>
//         <button className="logout-button" onClick={handleLogout}>
//           <FaSignOutAlt className="icon" /> Se déconnecter
//         </button>
//       </div>
//       <div className="content">
//         <div className="content-box">
//           {selectedContrat ? (
//             <FormulaireContrat 
//               contrat={selectedContrat} 
//               onSubmit={handleSubmitContrat} 
//               onCancel={() => setSelectedContrat(null)} 
//               setActiveTab={setActiveTab} 
//             />
//           ) : activeTab === "employes" ? (
//             <EmployeComponent />
//           ) : (
//             <OffreAdminComponent onReserverClick={handleReserverClick} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminEntreprisePage;


