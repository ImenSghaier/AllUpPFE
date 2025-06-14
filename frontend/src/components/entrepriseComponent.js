import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntreprises, addEntreprise, updateEntreprise, deleteEntreprise } from '../redux/actions/entrepriseAction';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './entrepriseComponent.css';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const EntrepriseComponent = () => {
  const dispatch = useDispatch();
  const { entreprises, page, pages } = useSelector((state) => state.entreprise);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('nom');
  const [formData, setFormData] = useState({ nom: '', email: '', adresse: '', telephone: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedEntreprise, setSelectedEntreprise] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [entrepriseToDelete, setEntrepriseToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchEntreprises(page, 10, search, sort));
  }, [dispatch, page, search, sort]);

  const handleAddClick = () => {
    setFormData({ nom: '', email: '', adresse: '', telephone: '' });
    setIsEditing(false);
    setIsAdding(true);
    setSelectedEntreprise(null);
  };

  const handleEdit = (entreprise) => {
    setFormData({
      nom: entreprise.nom,
      email: entreprise.email,
      adresse: entreprise.adresse,
      telephone: entreprise.telephone || ''
    });
    setSelectedEntreprise(entreprise);
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleAddEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nom || !formData.email || !formData.adresse || !formData.telephone) {
      toast.error("Tous les champs sont obligatoires !", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      if (isEditing) {
        await dispatch(updateEntreprise(selectedEntreprise._id, formData));
        toast.success("Entreprise modifiée avec succès !", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        await dispatch(addEntreprise(formData));
        toast.success("Entreprise ajoutée avec succès !", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      setFormData({ nom: '', email: '', adresse: '', telephone: '' });
      setIsEditing(false);
      setIsAdding(false);
      setSelectedEntreprise(null);
    } catch (error) {
      toast.error("Une erreur est survenue : " + error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const confirmDelete = (id) => {
    const entreprise = entreprises.find(e => e._id === id);
    setEntrepriseToDelete(entreprise);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteEntreprise(entrepriseToDelete._id));
      toast.success(`Entreprise "${entrepriseToDelete.nom}" supprimée avec succès`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setShowDeleteConfirm(false);
      setEntrepriseToDelete(null);
    } catch (error) {
      toast.error("Erreur lors de la suppression : " + error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchEntreprises(newPage, 10, search, sort));
  };

  return (
    <div className="entreprise-container">
      <ToastContainer />
      
      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3 className='h3E'>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer l'entreprise "{entrepriseToDelete?.nom}" ?</p>
            <div className="form-actions">
              <button 
                className="submit-button delete-confirm-button" 
                onClick={handleDelete}
              >
                Confirmer
              </button>
              <button 
                className="close-button" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="header">
        <h2>Entreprises</h2>
        <div className="search-sort">
          <input
            type="text"
            className="search-input-e"
            placeholder="Rechercher "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="search-sort">
            <div className="select-wrapper">
                <label htmlFor="sort" className="sort-label">Trié par :</label>
                <select
                className="sort-select"
                onChange={(e) => setSort(e.target.value)}
                value={sort}
                >
                <option value="nom">Nom</option>
                <option value="email">Email</option>
                </select>
            </div>
          </div>

          <button className="add-button-e" onClick={handleAddClick}>Ajouter Entreprise</button>
        </div>
      </div>

      {(isEditing || isAdding) && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3 className='h3E'>{isEditing ? 'Modifier' : 'Ajouter'} une entreprise</h3>
            <form className="entreprise-form" onSubmit={handleAddEditSubmit}>
              <div className="form-group">
                <label className="label" htmlFor="nom">Nom de l'entreprise</label>
                <input
                  id="nom"
                  type="text"
                  className="form-input"
                  placeholder="Nom de l'entreprise"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="label" htmlFor="adresse">Adresse</label>
                <input
                  id="adresse"
                  type="text"
                  className="form-input"
                  placeholder="Adresse"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="label" htmlFor="telephone">Téléphone</label>
                <input
                  id="telephone"
                  type="text"
                  className="form-input"
                  placeholder="Téléphone"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button className="submit-button" type="submit">
                  {isEditing ? 'Modifier' : 'Ajouter'}
                </button>
                <button className="close-button" type="button" onClick={() => setIsAdding(false) || setIsEditing(false)}>
                  ❌ Fermer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="entreprise-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Adresse</th>
            <th>Téléphone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entreprises.map((entreprise) => (
            <tr key={entreprise._id}>
              <td>{entreprise.nom}</td>
              <td>{entreprise.email}</td>
              <td>{entreprise.adresse}</td>
              <td>{entreprise.telephone || 'Non renseigné'}</td>
              <td><div className="action-buttons">
                <button className="edit-button" onClick={() => handleEdit(entreprise)}><FiEdit2 className="icon" /> Modifier</button>
                <button className="delete-button" onClick={() => confirmDelete(entreprise._id)}> <FiTrash2 className="icon" /> Supprimer</button></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Précédent</button>
        <span>Page {page} sur {pages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === pages}>Suivant</button>
      </div>
    </div>
  );
};

export default EntrepriseComponent;