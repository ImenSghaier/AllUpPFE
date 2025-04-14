
// components/NotificationListener.jsx
import { useEffect } from "react";
import { io } from "socket.io-client";

// Connecte-toi à ton backend (remplace l'URL si besoin)
const socket = io("http://localhost:4000"); // ou ton domaine de backend
function NotificationListenerNewContrat({userId}) {
    useEffect(() => {
      console.log('user Id', userId)
      // Rejoindre la room personnelle de l'utilisateur
      if (userId) {
          console.log('user Id', userId)
        socket.emit("join", userId);
      }
  
      // Écouter les notifications en temps réel
      socket.on("newCont", (data) => {
        console.log("🔔 Nouvelle notification :", data);
  
        // Exemple d'affichage : une simple alerte (à remplacer par toast, modal, etc.)
        alert(`${data.title}: ${data.message}`);
        
        // Tu peux aussi stocker les notifications dans un state global ou context
      });
  
      // Nettoyage à la fin
      return () => {
        socket.off("newCont");
      };
    }, [userId]);
  
    return null; // ou un badge / cloche d'alerte si tu veux
  }
  
  export default NotificationListenerNewContrat;