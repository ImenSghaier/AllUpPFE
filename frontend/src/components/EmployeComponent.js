import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, addEmployee, importEmployees, editEmployee, removeEmployee } from "../redux/actions/employeAction";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import './EmployeComponent.css';

// Import des icônes
import { 
  FiUsers, FiSearch, FiPlus, FiEdit2, FiTrash2, 
  FiUpload, FiX, FiCheck, FiDownload,
  FiUser, FiMail, FiPhone, FiFilter, FiAlertTriangle,
} from 'react-icons/fi';

const EmployeComponent = () => {
  const dispatch = useDispatch();
  const { employees, error } = useSelector((state) => state.employe);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("nom");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [formData, setFormData] = useState({ nom: "", email: "", telephone: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [notification, setNotification] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showNotification(error, "error");
    }
  }, [error]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleSortChange = (value) => setSortBy(value);

  const filteredEmployees = (Array.isArray(employees) ? employees : [])
    .filter((emp) =>
      (emp.nom?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      (emp.email?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      (emp.telephone?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenModal = (employee = null) => {
    setCurrentEmployee(employee);
    setFormData(employee || { nom: "", email: "", telephone: "" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (currentEmployee) {
        await dispatch(editEmployee(currentEmployee._id, formData));
        showNotification("Employé modifié avec succès");
      } else {
        await dispatch(addEmployee(formData));
        showNotification("Employé ajouté avec succès");
      }
      handleCloseModal();
    } catch (err) {
      showNotification("Une erreur s'est produite", "error");
    }
  };

  const handleDeleteClick = (id) => {
    setEmployeeToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(removeEmployee(employeeToDelete));
      showNotification("Employé supprimé avec succès");
      setShowDeleteConfirm(false);
      setEmployeeToDelete(null);
    } catch (err) {
      showNotification("Erreur lors de la suppression", "error");
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setEmployeeToDelete(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleFileImport = async () => {
    if (!file) {
      showNotification("Veuillez sélectionner un fichier", "error");
      return;
    }

    try {
      if (file.type.includes("excel") || file.type.includes("spreadsheet")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const employeesData = XLSX.utils.sheet_to_json(sheet);
          dispatch(importEmployees(employeesData))
            .then(() => showNotification("Importation réussie"))
            .catch(() => showNotification("Erreur lors de l'importation", "error"));
        };
        reader.readAsBinaryString(file);
      } else {
        Papa.parse(file, {
          complete: (result) => {
            dispatch(importEmployees(result.data))
              .then(() => showNotification("Importation réussie"))
              .catch(() => showNotification("Erreur lors de l'importation", "error"));
          },
          header: true,
          error: () => showNotification("Erreur de lecture du fichier", "error")
        });
      }
      setFile(null);
      setFileName("");
    } catch (err) {
      showNotification("Erreur lors du traitement du fichier", "error");
    }
  };

  const Notification = ({ message, type }) => {
    if (!message) return null;

    return (
      <div className={`notification notification-${type}`}>
        {type === "success" ? <FiCheck className="icon" /> : <FiX className="icon" />}
        <span>{message}</span>
      </div>
    );
  };

  return (
    <div className="employee-container">
      <div className="employee-header">
        <h1 className="employee-title">
          <FiUsers className="icon" /> Employés
        </h1>

        <div className="search-container">
          
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un employé..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <select 
          className="filter-selectedd"
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="nom"><FiFilter /> Nom</option>
          <option value="email"><FiFilter /> Email</option>
        </select>

        <button className="btn-primaryy" onClick={() => handleOpenModal()}>
          <FiPlus className="icon" /> Ajouter
        </button>
        </div>
        <div className="file-import-container">
          <input
            type="file"
            id="fileInput"
            className="file-input"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
          />
          <label htmlFor="fileInput" className="file-label">
            <FiUpload className="icon" /> Choisir un fichier
          </label>
          {fileName && <span className="file-name">{fileName}</span>}
          <button className="btn btn-accent" onClick={handleFileImport}>
            <FiDownload className="icon" /> Importer
          </button>
      
      </div>

      <table className="employee-table">
        <thead>
          <tr>
            <th><FiUser className="icon" /> Nom</th>
            <th><FiMail className="icon" /> Email</th>
            <th><FiPhone className="icon" /> Téléphone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEmployees.map((employee) => (
            <tr key={employee._id || employee.email}>
              <td>{employee.nom}</td>
              <td>{employee.email}</td>
              <td>{employee.telephone}</td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleOpenModal(employee)}
                  >
                    <FiEdit2 className="icon" /> Modifier
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDeleteClick(employee._id)}
                  >
                    <FiTrash2 className="icon" /> Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredEmployees.length === 0 && (
        <div className="empty-state">
          <FiUsers size={48} />
          <h3>Aucun employé trouvé</h3>
          <p>Aucun employé ne correspond à vos critères de recherche.</p>
        </div>
      )}

      <div className="pagination-container">
        <div className="pagination">
          {currentPage > 1 && (
            <button onClick={() => setCurrentPage(currentPage - 1)}>
              Précédent
            </button>
          )}
          
          {Array.from({ length: Math.ceil(filteredEmployees.length / pageSize) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          
          {currentPage < Math.ceil(filteredEmployees.length / pageSize) && (
            <button onClick={() => setCurrentPage(currentPage + 1)}>
              Suivant
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {currentEmployee ? <FiEdit2 /> : <FiPlus />}
                {currentEmployee ? "Modifier Employé" : "Ajouter Employé"}
              </h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  className="form-input"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Nom complet"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-input"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Adresse email"
                />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="text"
                  className="form-input"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="Numéro de téléphone"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseModal}>
                Annuler
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSubmit}
                disabled={!formData.nom || !formData.email || !formData.telephone}
              >
                {currentEmployee ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                <FiAlertTriangle className="icon" /> Confirmer la suppression
              </h2>
              <button className="modal-close" onClick={cancelDelete}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer cet employé ?</p>
              <p>Cette action est irréversible.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={cancelDelete}>
                Annuler
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      <Notification 
        message={notification?.message} 
        type={notification?.type}
      />
    </div>
  );
};

export default EmployeComponent;