import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { io } from "socket.io-client";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import FournisseurPage from "./pages/FournisseurPage";
import EmployeePage from "./pages/EmployeePage";
import AdminEntreprisePage from "./pages/AdminEntreprisePage";
import PrivateRoute from "./components/PrivateRoute";
import FormulaireContrat from "./components/FormulaireContract";
import OffreAdminComponent from "./components/offreAdminComponent";
import NotificationListener from "./components/NotificationListener";
import { jwtDecode } from "jwt-decode";
import NotificationListenerNewContrat from "./components/NotificationNewContact";

// Connexion WebSocket au backend
const socket = io("http://localhost:4000"); // Assure-toi que le port correspond au backend

function App() {
  // Supposons que tu récupères l'ID de l'utilisateur connecté depuis le localStorage
  const token = localStorage.getItem("token");
   
        const decodedToken = jwtDecode(token);
        const userId = decodedToken._id;
       

  // useEffect(() => {
  //   if (userId) {
  //     socket.emit("join", userId); // Connexion à son propre canal

  //     socket.on("new_contract", (data) => {
  //       alert(`📢 Nouveau contrat reçu : ${data.contract.details}`);
  //     });

  //     socket.on("contractUpdated", (contract) => {
  //       alert(`✅ Contrat mis à jour : ${contract.status}`);
  //     });

  //     return () => {
  //       socket.disconnect();
  //     };
  //   }
  // }, [userId]);

  return (
    <>
    <NotificationListener userId={userId}/>
    <NotificationListenerNewContrat userId={userId} />
    <Routes>
      {/* Routes accessibles à tous */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Routes protégées */}
      <Route element={<PrivateRoute />}>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/fournisseur" element={<FournisseurPage />} />
        <Route path="/employe" element={<EmployeePage />} />
        <Route path="/admin-entreprise/*" element={<AdminEntreprisePage />} />
        <Route path="/formulaire-contrat" element={<FormulaireContrat />} />
        
      </Route>
    </Routes>
    </>
    
  );
}

export default App;




// import "./App.css";
// import { Route, Routes } from "react-router-dom";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import AdminPage from "./pages/AdminPage";
// import FournisseurPage from "./pages/FournisseurPage";
// import EmployeePage from "./pages/EmployeePage";
// import AdminEntreprisePage from "./pages/AdminEntreprisePage";
// import PrivateRoute from "./components/PrivateRoute";
// import FormulaireContrat from "./components/FormulaireContrat";

// function App() {
//   return (
//     <Routes>
//       {/* Routes accessibles à tous */}
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<Login />} />

//       {/* Routes protégées */}
//       <Route element={<PrivateRoute />}>
//         <Route path="/admin" element={<AdminPage />} />
//         <Route path="/fournisseur" element={<FournisseurPage />} />
//         <Route path="/employe" element={<EmployeePage />} />
//         <Route path="/admin-entreprise/*" element={<AdminEntreprisePage />} />
//         <Route path="/formulaire-contrat" element={<FormulaireContrat />} />


//       </Route>
//     </Routes>
//   );
// }

// export default App;
