import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, editUser, removeUser } from '../redux/actions/userAction';
import { fetchEntrepriseNames } from '../services/entrepriseService';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiUser, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { HiOutlineOfficeBuilding, HiOutlineMail, HiOutlinePhone, HiOutlineShieldCheck, HiOutlineUserGroup } from 'react-icons/hi';
import 'react-toastify/dist/ReactToastify.css';
import './CreateUserForm.css';

const CreateUserForm = () => {
    const dispatch = useDispatch();
    const { users, totalPages, currentPage, error } = useSelector((state) => state.userReducer);

    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [role, setRole] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [entreprises, setEntreprises] = useState([]);
    const [selectedEntreprise, setSelectedEntreprise] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState('nom');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchUsers(currentPage, search, filterRole, sortBy));
    }, [dispatch, currentPage, search, filterRole, sortBy]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchEntrepriseNames();
                setEntreprises(data);
            } catch (error) {
                console.error('Erreur lors du chargement des entreprises:', error);
                toast.error('Erreur lors du chargement des entreprises');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let userData = { nom, email, telephone, role };

        if (role === 'AdminEntreprise' || role === 'Employé') {
            userData.id_entreprise = selectedEntreprise || null;
        } else {
            delete userData.id_entreprise;
        }

        try {
            if (selectedUser) {
                await dispatch(editUser(selectedUser._id, userData));
                toast.success('Utilisateur modifié avec succès');
            } else {
                await dispatch(addUser(userData));
                toast.success('Utilisateur ajouté avec succès');
            }
            closeModal();
        } catch (err) {
            toast.error('Erreur lors de la sauvegarde');
        }
    };

    const handleEdit = (user) => {
        setNom(user.nom);
        setEmail(user.email);
        setTelephone(user.telephone);
        setRole(user.role);
        setSelectedUser(user);

        if (user.role === 'AdminEntreprise' || user.role === 'Employé') {
            setSelectedEntreprise(user.id_entreprise || '');
        } else {
            setSelectedEntreprise('');
        }

        setIsModalOpen(true);
    };

    const confirmDelete = (userId) => {
        const user = users.find(u => u._id === userId);
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await dispatch(removeUser(userToDelete._id));
            toast.success(`Utilisateur "${userToDelete.nom}" supprimé avec succès`);
            setShowDeleteConfirm(false);
            setUserToDelete(null);
        } catch (err) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const openModal = () => {
        setSelectedUser(null);
        setNom('');
        setEmail('');
        setTelephone('');
        setRole('');
        setSelectedEntreprise('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="user-management-container">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            
            {/* Confirmation de suppression */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                    >
                        <motion.div 
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="confirmation-modal"
                        >
                            <h3>Confirmer la suppression</h3>
                            <p>Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userToDelete?.nom}</strong> ?</p>
                            <div className="modale-actions">
                                <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
                                    <FiX /> Annuler
                                </button>
                                <button className="deletee-btn" onClick={handleDelete}>
                                    <FiTrash2 /> Confirmer
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal d'ajout/modification */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                        onClick={closeModal}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="user-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="close-modal" onClick={closeModal}>
                                <FiX />
                            </button>
                            <h2>
                                <FiUser /> {selectedUser ? 'Modifier' : 'Ajouter'} un utilisateur
                            </h2>
                            
                            <form onSubmit={handleSubmit} className="user-form">
                                <div className="form-group">
                                    <label><FiUser /> Nom</label>
                                    <input 
                                        type="text" 
                                        value={nom} 
                                        onChange={(e) => setNom(e.target.value)} 
                                        placeholder="Nom complet" 
                                        required 
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label><HiOutlineMail /> Email</label>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder="Adresse email" 
                                        required 
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label><HiOutlinePhone /> Téléphone</label>
                                    <input 
                                        type="tel" 
                                        value={telephone} 
                                        onChange={(e) => setTelephone(e.target.value)} 
                                        placeholder="Numéro de téléphone" 
                                        required 
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label><HiOutlineShieldCheck /> Rôle</label>
                                    <select 
                                        value={role} 
                                        onChange={(e) => {
                                            setRole(e.target.value);
                                            if (e.target.value !== 'AdminEntreprise' && e.target.value !== 'Employé') {
                                                setSelectedEntreprise('');
                                            }
                                        }} 
                                        required
                                    >
                                        <option value="" disabled>Sélectionnez un rôle</option>
                                        <option value="AdminEntreprise">Admin Entreprise</option>
                                        <option value="Fournisseur">Fournisseur</option>
                                        {/* <option value="Employé">Employé</option> */}
                                    </select>
                                </div>

                                {(role === 'AdminEntreprise' || role === 'Employé') && (
                                    <div className="form-group">
                                        <label><HiOutlineOfficeBuilding /> Entreprise</label>
                                        <select 
                                            value={selectedEntreprise} 
                                            onChange={(e) => setSelectedEntreprise(e.target.value)} 
                                            required
                                        >
                                            <option value="">Sélectionnez une entreprise</option>
                                            {entreprises.map((entreprise) => (
                                                <option key={entreprise._id} value={entreprise._id}>
                                                    {entreprise.nom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                
                                <button type="submit" className="submit-btn">
                                    {selectedUser ? 'Mettre à jour' : 'Créer utilisateur'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* En-tête */}
            <div className="management-header">
                <div className="header-content">
                    <h1>
                        <HiOutlineUserGroup /> Gestion des Utilisateurs
                    </h1>
                    {/* <br/>
                    <p>Gérez les comptes utilisateurs et leurs permissions</p> */}
                </div>
                
                <button onClick={openModal} className="add-user-btn">
                    <FiPlus color='white' size={18} />  utilisateur
                </button>
            </div>

            {/* Barre de filtres */}
            <div className="filters-bar">
                <div className="search-box">
                    <FiSearch />
                    <input 
                        type="text" 
                        placeholder="Rechercher un utilisateur..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                </div>
                
                <div className="filter-group">
                    <label>Filtrer par rôle :</label>
                    <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                        <option value="">Tous les rôles</option>
                        <option value="AdminEntreprise">Admin Entreprise</option>
                        <option value="Fournisseur">Fournisseur</option>
                        <option value="Employé">Employé</option>
                    </select>
                </div>
                
                <div className="filter-group">
                    <label>Trier par :</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="nom">Nom (A-Z)</option>
                        <option value="-nom">Nom (Z-A)</option>
                        <option value="email">Email (A-Z)</option>
                        <option value="-email">Email (Z-A)</option>
                    </select>
                </div>
            </div>

            {/* Tableau des utilisateurs */}
            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Rôle</th>
                            <th>Entreprise</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <motion.tr 
                                key={user._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <td>{user.nom}</td>
                                <td>{user.email}</td>
                                <td>{user.telephone}</td>
                                <td>
                                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    {(user.role === 'AdminEntreprise' || user.role === 'Employé') 
                                        ? entreprises.find(e => e._id === user.id_entreprise)?.nom || 'Non attribuée'
                                        : '-'}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        {user.role !== 'Employé' && (
                                            <>
                                                <button 
                                                    onClick={() => handleEdit(user)} 
                                                    className="edit-btn"
                                                    title="Modifier"
                                                >
                                                    <FiEdit2 className="icon" />Modifier
                                                </button>
                                                <button 
                                                    onClick={() => confirmDelete(user._id)} 
                                                    className="delete-btn"
                                                    title="Supprimer"
                                                >
                                                     <FiTrash2 className="icon" />Supprimer
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pagination-controls">
                <button 
                    onClick={() => dispatch(fetchUsers(currentPage - 1))} 
                    disabled={currentPage <= 1}
                    className="pagination-btn"
                >
                    <FiChevronLeft /> Précédent
                </button>
                
                <span className="page-info">
                    Page {currentPage} sur {totalPages}
                </span>
                
                <button 
                    onClick={() => dispatch(fetchUsers(currentPage + 1))} 
                    disabled={currentPage >= totalPages}
                    className="pagination-btn"
                >
                    Suivant <FiChevronRight />
                </button>
            </div>
        </div>
    );
};

export default CreateUserForm;