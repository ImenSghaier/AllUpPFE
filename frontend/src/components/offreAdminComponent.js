import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOffresPaginated } from "../redux/actions/offreAction";
import "./offreAdminComponent.css";


const OffreAdminComponent = ({ onReserverClick }) => {
    const dispatch = useDispatch();
    const { offres, totalPages, loading } = useSelector((state) => state.offre);
    
    const [search, setSearch] = useState("");
    const [categorie, setCategorie] = useState("");
    const [type, setType] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    const categories = [
        "Hotels & vacations",
        "Shopping",
        "Santé & bien-être",
        "Restaurant & lounge",
        "Formation & workshop",
        "Transports",
        "Événements & loisirs",
        "Culture",
    ];
    const types = ["PROMOTION", "REDUCTION"];

    useEffect(() => {
        dispatch(fetchOffresPaginated(page, itemsPerPage, "titre", "asc", { search, categorie, type }));
    }, [dispatch, page, search, categorie, type, itemsPerPage]);

    const handlePageChange = (newPage) => setPage(newPage);

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setPage(1);
    };
    const handleReserverClick = (offre) => {
        if (!offre._id || !offre.id_fournisseur) {
            alert("Erreur : Informations du contrat manquantes.");
            return;
        }
    
        const contrat = {
            id_offre: offre._id,
            id_fournisseur: offre.id_fournisseur,
        };
    
        if (onReserverClick) onReserverClick(contrat);
    };
    
    
    
      
    return (
        <div className="offre-admin-container">
            <h1>Offres</h1>
            <div className="filters">
                <input type="text" placeholder="Rechercher par titre..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <select onChange={(e) => setCategorie(e.target.value)} value={categorie}>
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>
                <select onChange={(e) => setType(e.target.value)} value={type}>
                    <option value="">Sélectionner un type d'offre</option>
                    {types.map((t, index) => (
                        <option key={index} value={t}>{t}</option>
                    ))}
                </select>
                <select onChange={handleItemsPerPageChange} value={itemsPerPage}>
                    <option value={6}>6 par page</option>
                    <option value={9}>9 par page</option>
                    <option value={12}>12 par page</option>
                </select>
            </div>
            <div className="offer-cards">
                {loading ? (
                    <p>Chargement...</p>
                ) : (
                    offres.map((offre) => (
                        <div key={offre._id} className="offer-card">
                            <img src={`http://localhost:4000/uploads/${offre.image}`} alt={offre.titre} />
                            <h3>{offre.titre}</h3>
                            <p>{offre.description}</p>
                           
                            <p className="type">{offre.type}</p>
                            <div className="price-section">
                                          {/* Afficher le pourcentage de réduction seulement si le type est "REDUCTION" */}
                                    {offre.type === 'REDUCTION' && offre.pourcentage_reduction && (
                                        <p className="discount-percentage">-{offre.pourcentage_reduction}%</p>
                                    )} 
                                <p className="original-price">{offre.prix} DNT</p>
                                
                                {offre.prix_apres_reduction && (
                                    <div className="discounted-price">
                              
                            <h5>{offre.prix_apres_reduction} DNT</h5>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => handleReserverClick(offre)} className="btnn-reserver">
                                Réserver
                            </button>
                        </div>
                    ))
                )}
            </div>
            <div className="pagination">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Précédent</button>
                <span>Page {page} sur {totalPages}</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Suivant</button>
            </div>
        </div>
    );
};

export default OffreAdminComponent;

