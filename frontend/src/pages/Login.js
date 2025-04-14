import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/actions/authAction";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Login() {
  const [errorMessage, setErrorMessage] = useState(""); // Stocke le message d'erreur
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Validation avec Yup
  const validationSchema = Yup.object({
    email: Yup.string().email("Email invalide").required("L'email est requis"),
    mot_de_passe: Yup.string()
      .min(8, "Min 8 caractères")
      .required("Mot de passe requis"),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(login(values.email, values.mot_de_passe, navigate));
      console.log("Réponse login :", response); // Debug: voir la réponse
      // Vérifie si la réponse contient une erreur
      if (!response || response.error) {
        throw new Error("Identifiants incorrects");
      }
    } catch (error) {
      console.error("Erreur login :", error.message); // Debug: voir l'erreur
      setErrorMessage("Email ou mot de passe invalide");
      setTimeout(() => setErrorMessage(""), 5000); // Efface après 5s
    }
    setSubmitting(false);
  };

  return (
    <div className="body">
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      ></link>

      {/*  Message d'erreur global en haut */}
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      <div className="wrapper">
        <Formik
          initialValues={{ email: "", mot_de_passe: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form>
              <center>
                <h2>Connexion</h2>
              </center>

              <div className="input-box">
                <Field type="email" name="email" placeholder="Email" />
                <i className="bx bxs-user"></i>
                <ErrorMessage name="email" component="div" className="error-text" />
              </div>

              <div className="input-box">
                <Field type="password" name="mot_de_passe" placeholder="Mot de passe" />
                <i className="bx bxs-lock-alt"></i>
                <ErrorMessage name="mot_de_passe" component="div" className="error-text" />
              </div>

              <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? "Connexion..." : "Se connecter"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;


// import React , { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { login } from '../redux/actions/authAction';
// import { useNavigate } from 'react-router-dom';
// import './Login.css';
// import {Formik ,Form ,Field ,ErrorMessage} from "formik";
// import * as Yup from "yup";
// function Login(){
//   const [errorMessage, setErrorMessage] = useState("");
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

// //validation avec yup
// const validationSchema = Yup.object({
//   email:Yup.string().email("Email invalide").required("L'email est requis"),
//   mot_de_passe:Yup.string().min(8,'Min 8 caractéres').required("Mot de passe requis ")
// })


// const handleLogin = async (values, { setSubmitting }) => {
//   try {
//     await dispatch(login(values.email, values.mot_de_passe, navigate));
//   } catch (error) {
//     setErrorMessage("Email ou mot de passe invalide");
//     setTimeout(() => setErrorMessage(""), 5000);
//   }
//   setSubmitting(false);
// };

//     return(
//       <div className="body">
//       <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet"></link>
//       <div className="wrapper">
//         <Formik
//           initialValues={{ email: "", mot_de_passe: "" }}
//           validationSchema={validationSchema}
//           onSubmit={handleLogin}
//         >
//           {({ isSubmitting }) => (
//             <Form>
//               <center><h2>Connexion</h2></center>

//               {/* Message d'erreur global */}
//               {errorMessage && <div className="error-message">{errorMessage}</div>}

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
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>

//     )
// }
// export default Login;