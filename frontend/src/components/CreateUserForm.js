import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, editUser, removeUser } from '../redux/actions/userAction';
import { fetchEntrepriseNames } from '../services/entrepriseService';
import './CreateUserForm.css';

const CreateUserForm = () => {
    const dispatch = useDispatch();
    const { users,totalPages, currentPage, error } = useSelector((state) => state.userReducer);
    
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
    const [sortBy, setSortBy] = useState('1');

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
            }
        };
        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        let userData = { nom, email, telephone, role };

        // Vérifier si le rôle sélectionné nécessite une entreprise
        if (role === 'AdminEntreprise' || role === 'Employé') {
            userData.id_entreprise = selectedEntreprise || null;
        } else {
            delete userData.id_entreprise;
        }

        if (selectedUser) {
            dispatch(editUser(selectedUser._id, userData));
        } else {
            dispatch(addUser(userData));
        }
        closeModal();
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
        <div className="user-form-container">
            <div className="filter-section">
                <h2 className='h3'>Utilisateurs</h2>
                <input type="text" placeholder="🔍 Recherche..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
                <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="filter-select">
                    <option value="">Tous les rôles</option>
                    <option value="Fournisseur">Fournisseur</option>
                    <option value="AdminEntreprise">AdminEntreprise</option>
                    <option value="Employé">Employé</option>
                </select>
                
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                    <option value="nom">Nom</option>
                    <option value="email">Email</option>
                </select>

                <button onClick={openModal} className="add-button">+ Ajouter un utilisateur</button>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{selectedUser ? 'Modifier' : 'Ajouter'} un utilisateur</h2>
                        <form onSubmit={handleSubmit} className="user-form">
                            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom" required className="input-field" />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="input-field" />
                            <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="Téléphone" required className="input-field" />
                            <select value={role} onChange={(e) => {
                                setRole(e.target.value);
                                if (e.target.value !== 'AdminEntreprise' && e.target.value !== 'Employé') {
                                    setSelectedEntreprise('');
                                }
                            }} required className="select-field">
                                <option value="" disabled>Rôle</option>
                                <option value="AdminEntreprise">AdminEntreprise</option>
                                <option value="Fournisseur">Fournisseur</option>
                                
                            </select>
                            {(role === 'AdminEntreprise' || role === 'Employé') && (
                                <select value={selectedEntreprise} onChange={(e) => setSelectedEntreprise(e.target.value)} required className="select-field">
                                    <option value="">Sélectionner une entreprise</option>
                                    {entreprises.map((entreprise) => (
                                        <option key={entreprise._id} value={entreprise._id}>{entreprise.nom}</option>
                                    ))}
                                </select>
                            )}
                            <button type="submit" className="submit-button">{selectedUser ? 'Modifier' : 'Ajouter'} Utilisateur</button>
                        </form>
                    </div>
                </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <table className="user-table">
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
                        <tr key={user._id}>
                            <td>{user.nom}</td>
                            <td>{user.email}</td>
                            <td>{user.telephone}</td>
                            <td>{user.role}</td>
                            <td>
                                {(user.role === 'AdminEntreprise' || user.role === 'Employé') 
                                    ? entreprises.find(e => e._id === user.id_entreprise)?.nom || 'Non attribuée' 
                                    : ''}
                            </td>
                            <td><center>
                                {user.role !== 'Employé' && (
                                    <>  <div className="action-buttons">
                                        <button onClick={() => handleEdit(user)} className="edit-button">✏️ Modifier</button>
                                        <button onClick={() => dispatch(removeUser(user._id))} className="delete-button">🗑️ Supprimer</button>
                                    </div></>
                                )}
                            </center></td>

                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Pagination */}
            <div className="pagination">
                <button onClick={() => dispatch(fetchUsers(currentPage - 1))} disabled={currentPage <= 1}>Précédent</button>
                <span>Page {currentPage} sur {totalPages}</span>
                <button onClick={() => dispatch(fetchUsers(currentPage + 1))} disabled={currentPage >= totalPages}>Suivant</button>
            </div>
        </div>
    );
};

export default CreateUserForm;

 