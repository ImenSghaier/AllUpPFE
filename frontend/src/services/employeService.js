import axios from "axios";
import {jwtDecode} from "jwt-decode";

// Récupérer le token depuis le localStorage
const getToken = () => localStorage.getItem("token");

// Décoder le token pour obtenir l'id_entreprise
const getEntrepriseId = () => {
    const token = getToken();
    if (!token) return null;
    
    try {
        const decoded = jwtDecode(token);
        return decoded.id_entreprise || null;
    } catch (error) {
        console.error("❌ Erreur de décodage du token :", error);
        return null;
    }
};

// ⚡ Récupérer tous les employés de l'AdminEntreprise
export const getEmployees = async () => {
    try {
        const token = getToken();
        const entrepriseId = getEntrepriseId();

        if (!token || !entrepriseId) throw new Error("Token invalide ou ID entreprise introuvable");

        const response = await axios.get("http://localhost:4000/user/employees", {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des employés :", error);
        throw error;
    }
};

// ⚡ Ajouter un employé
export const createEmployee = async (employeeData) => {
    try {
        const token = getToken();

        if (!token) throw new Error("Token introuvable");

        const response = await axios.post("http://localhost:4000/user/create-employee", employeeData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Erreur lors de la création de l'employé :", error);
        throw error;
    }
};
// ⚡ Ajouter des employés depuis un fichier
export const importEmployeesFromFile = async (employeesData) => {
    try {
        const token = getToken();

        if (!token) throw new Error("Token introuvable");

        const response = await axios.post("http://localhost:4000/user/import-employees", employeesData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Erreur lors de l'importation des employés :", error);
        throw error;
    }
};

// ⚡ Modifier un employé
export const updateEmployee = async (id, employeeData) => {
    try {
        const token = getToken();

        if (!token) throw new Error("Token introuvable");

        const response = await axios.put(`http://localhost:4000/user/update-employee/${id}`, employeeData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Erreur lors de la modification de l'employé :", error);
        throw error;
    }
};

// ⚡ Supprimer un employé
export const deleteEmployee = async (id) => {
    try {
        const token = getToken();

        if (!token) throw new Error("Token introuvable");

        const response = await axios.delete(`http://localhost:4000/user/delete-employee/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Erreur lors de la suppression de l'employé :", error);
        throw error;
    }
};
