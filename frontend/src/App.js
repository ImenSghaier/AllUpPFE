import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import FournisseurPage from "./pages/FournisseurPage";
import EmployeePage from "./pages/EmployeePage";
import AdminEntreprisePage from "./pages/AdminEntreprisePage";
import PrivateRoute from "./components/PrivateRoute";
import FormulaireContrat from "./components/FormulaireContract";
import NotificationListener from "./components/NotificationListener";
import { jwtDecode } from "jwt-decode";
import NotificationListenerNewContrat from "./components/NotificationNewContact";
import ForgotPasswordComponent from "./components/ForgotPasswordComponent";

function App() {
  const token = localStorage.getItem("token");
  let userId = null;
  

  if (token && typeof token === "string") {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken?._id;
      userRole = decodedToken?.role;
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
    }
  }

  return (
    <>
      {userId && (
        <>
          <NotificationListener userId={userId} />
          <NotificationListenerNewContrat userId={userId} />
        </>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasswordComponent />} />
        <Route element={<PrivateRoute />}>
          <Route path="/admin/*" element={<AdminPage />}/>
            {/* <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="entreprises" element={<EntrepriseComponent />} />
            <Route path="create-user" element={<CreateUserForm />} />
          </Route> */}
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
// import FormulaireContrat from "./components/FormulaireContract";
// import NotificationListener from "./components/NotificationListener";
// import { jwtDecode } from "jwt-decode";
// import NotificationListenerNewContrat from "./components/NotificationNewContact";
// import ForgotPasswordComponent from "./components/ForgotPasswordComponent";

// function App() {
//   const token = localStorage.getItem("token");
//   let userId = null;

//   if (token && typeof token === "string") {
//     try {
//       const decodedToken = jwtDecode(token);
//       userId = decodedToken?._id;
//     } catch (error) {
//       console.error("Erreur lors du décodage du token :", error);
//       // Tu peux aussi forcer un logout ici si le token est invalide
//     }
//   }

//   return (
//     <>
//       {userId && (
//         <>
//           <NotificationListener userId={userId} />
//           <NotificationListenerNewContrat userId={userId} />
//         </>
//       )}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgot-password" element={<ForgotPasswordComponent />} />
//         <Route element={<PrivateRoute />}>
//           <Route path="/admin" element={<AdminPage />} />
//           <Route path="/fournisseur" element={<FournisseurPage />} />
//           <Route path="/employe" element={<EmployeePage />} />
//           <Route path="/admin-entreprise/*" element={<AdminEntreprisePage />} />
//           <Route path="/formulaire-contrat" element={<FormulaireContrat />} />
//         </Route>
//       </Routes>
//     </>
//   );
// }

// export default App;


