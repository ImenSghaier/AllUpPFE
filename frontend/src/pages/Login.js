import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/actions/authAction";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import logo from './logo-all-up.png';

function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Email invalide").required("L'email est requis"),
    mot_de_passe: Yup.string()
      .min(8, "Min 8 caractères")
      .required("Mot de passe requis"),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(login(values.email, values.mot_de_passe, navigate));
      if (!response || response.error) {
        throw new Error("Identifiants incorrects");
      }
    } catch (error) {
      setErrorMessage("Email ou mot de passe invalide");
      setTimeout(() => setErrorMessage(""), 5000);
    }
    setSubmitting(false);
  };

  return (
    <div className="login-container">
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      ></link>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      ></link>

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      <div className="login-card">
        <div className="login-header">
          <img src={logo} alt="Logo" className="login-logo" />
          <h2>Connexion à votre compte</h2>
          <p>Entrez vos identifiants pour accéder à votre espace</p>
        </div>

        <Formik
          initialValues={{ email: "", mot_de_passe: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-container">
                  <i className="bx bxs-envelope"></i>
                  <Field type="email" name="email" placeholder="votre@email.com" />
                </div>
                <ErrorMessage name="email" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <label htmlFor="mot_de_passe">Mot de passe</label>
                <div className="input-container">
                  <i className="bx bxs-lock-alt"></i>
                  <Field type="password" name="mot_de_passe" placeholder="Votre mot de passe" />
                </div>
                <ErrorMessage name="mot_de_passe" component="div" className="error-text" />
              </div>

              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Se souvenir de moi</label>
                </div>
                <Link to="/forgot-password" className="forgot-password">Mot de passe oublié ?</Link>
              </div>

              <button type="submit" className="login-btn" disabled={isSubmitting}>
                {isSubmitting ? "Connexion en cours..." : "Se connecter"}
                <i className="bx bx-arrow-back bx-rotate-180"></i>
              </button>

             
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;

// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { login } from "../redux/actions/authAction";
// import { useNavigate, Link } from "react-router-dom"; // <-- Ajout de Link ici
// import "./Login.css";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import logo from './logo-all-up.png'; // Assurez-vous que le chemin est correct
// function Login() {
//   const [errorMessage, setErrorMessage] = useState(""); // Stocke le message d'erreur
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Validation avec Yup
//   const validationSchema = Yup.object({
//     email: Yup.string().email("Email invalide").required("L'email est requis"),
//     mot_de_passe: Yup.string()
//       .min(8, "Min 8 caractères")
//       .required("Mot de passe requis"),
//   });

//   const handleLogin = async (values, { setSubmitting }) => {
//     try {
//       const response = await dispatch(login(values.email, values.mot_de_passe, navigate));
//       console.log("Réponse login :", response); // Debug: voir la réponse
//       if (!response || response.error) {
//         throw new Error("Identifiants incorrects");
//       }
//     } catch (error) {
//       console.error("Erreur login :", error.message); // Debug: voir l'erreur
//       setErrorMessage("Email ou mot de passe invalide");
//       setTimeout(() => setErrorMessage(""), 5000);
//     }
//     setSubmitting(false);
//   };

//   return (
//     <div className="body">
//       <link
//         href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
//         rel="stylesheet"
//       ></link>

//       {/* Message d'erreur global */}
//       {errorMessage && (
//         <div className="error-message">
//           {errorMessage}
//         </div>
//       )}

//       <div className="wrapper">
//         <Formik
//           initialValues={{ email: "", mot_de_passe: "" }}
//           validationSchema={validationSchema}
//           onSubmit={handleLogin}
//         >
//           {({ isSubmitting }) => (
//             <Form>
//               <center>
//                 <img src={logo} alt="Logo" className="forgot-password-logo" />
//                 <h2>Connexion</h2>
//               </center>

//               <div className="input-box">
//                 <Field type="email" name="email" placeholder="Email" />
//                 <i className="bx bxs-user"></i>
//                 <ErrorMessage name="email" component="div" className="error-text" />
//               </div>

//               <div className="input-box">
//                 <Field type="password" name="mot_de_passe" placeholder="Mot de passe" />
//                 <i className="bx bxs-lock-alt"></i>
//                 <ErrorMessage name="mot_de_passe" component="div" className="error-text" />
//               </div>

              

//               <button type="submit" className="btn" disabled={isSubmitting}>
//                 {isSubmitting ? "Connexion..." : "Se connecter"}
//               </button>
//               {/* Lien vers la page mot de passe oublié */}
//               <div className="forgot-password">
//                 <Link to="/forgot-password">Mot de passe oublié ?</Link>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// }

// export default Login;
