import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOffres, createOffre, editOffre, removeOffre } from '../redux/actions/offreAction';
import { Upload, Modal, Button, Form, Table, Input, Select } from 'antd';
import { UploadOutlined , TagsOutlined} from '@ant-design/icons';
import './OffreComponent.css';
import { Pencil, Trash } from 'lucide-react';
import { PlusCircleOutlined } from '@ant-design/icons';
const OffreComponent = () => {
    const dispatch = useDispatch();
    const { offres, totalPages, currentPage, loading } = useSelector(state => state.offre);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentOffre, setCurrentOffre] = useState(null);
    const [modalTitle, setModalTitle] = useState('');
    const [buttonText, setButtonText] = useState('');
    const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
    };
    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        prix: '',
        pourcentage_reduction: '',
        image: null,
        type: 'REDUCTION',
        categorie: '',
        date_debut: '',
        date_fin: '',
    });

    // Etats pour les filtres
    const [filterCategorie, setFilterCategorie] = useState('');
    const [filterType, setFilterType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Appliquer les filtres dans l'appel à l'API
        dispatch(fetchOffres(currentPage, 10, 'titre', 'asc', { categorie: filterCategorie, type: filterType, search: searchQuery }));
    }, [currentPage, dispatch, filterCategorie, filterType, searchQuery]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleAddOrEdit = () => {
        const formattedStartDate = formData.date_debut ? new Date(formData.date_debut).toISOString().split('T')[0] : '';
        const formattedEndDate = formData.date_fin ? new Date(formData.date_fin).toISOString().split('T')[0] : '';

        const updatedData = {
            ...formData,
            date_debut: formattedStartDate,
            date_fin: formattedEndDate,
        };

        if (currentOffre) {
            dispatch(editOffre(currentOffre._id, updatedData));
        } else {
            dispatch(createOffre(updatedData));
        }

        setIsModalVisible(false);
        setCurrentOffre(null);
        setFormData({
            titre: '',
            description: '',
            prix: '',
            pourcentage_reduction: '',
            image: null,
            type: 'REDUCTION',
            categorie: '',
            date_debut: '',
            date_fin: '',
        });
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: "Êtes-vous sûr de vouloir supprimer cet offre ?",
            content: "Cette action est irréversible.",
            okText: "Oui",
            cancelText: "Annuler",
            onOk: () =>dispatch(removeOffre(id)),
    }); };

    const handleOpenModal = (offre = null) => {
        if (offre) {
            setCurrentOffre(offre);
            setFormData({
                titre: offre.titre,
                description: offre.description,
                prix: offre.prix,
                pourcentage_reduction: offre.pourcentage_reduction,
                image: offre.image,
                type: offre.type,
                categorie: offre.categorie,
                date_debut: offre.date_debut ? new Date(offre.date_debut).toISOString().split('T')[0] : '',
                date_fin: offre.date_fin ? new Date(offre.date_fin).toISOString().split('T')[0] : '',
            });
            setModalTitle('Modifier l\'offre');
            setButtonText('Modifier');
        } else {
            setCurrentOffre(null);
            setFormData({
                titre: '',
                description: '',
                prix: '',
                pourcentage_reduction: '',
                image: null,
                type: 'REDUCTION',
                categorie: '',
                date_debut: '',
                date_fin: '',
            });
            setModalTitle('Ajouter une offre');
            setButtonText('Ajouter');
        }
        setIsModalVisible(true);
    };

    return (
        <div className="offres-container">
            <h1> <TagsOutlined style={{ marginRight: '2px', fontSize: '27px', color: '#171F5D' }} /> Offres</h1>
            <div className="offres-header">
                
                <Input.Search 
                    className="search-barf" 
                    placeholder="Rechercher" 
                    onSearch={(value) => setSearchQuery(value)} 
                    style={{ marginBottom: '5px' }} 
                />
                
                {/* Filtre par catégorie */}
                <Select
                    className="filter-select-categorie"
                    value={filterCategorie}
                    onChange={(value) => setFilterCategorie(value)}
                    placeholder="Filtrer par catégorie"
                    style={{ width: 200, marginBottom: '20px' }}
                >
                    <Select.Option value="">Tous les Categories</Select.Option>
                    <Select.Option value="Hotels & vacations">Hotels & vacations</Select.Option>
                    <Select.Option value="Shopping">Shopping</Select.Option>
                    <Select.Option value="Santé & bien-être">Santé & bien-être</Select.Option>
                    <Select.Option value="Restaurant & lounge">Restaurant & lounge</Select.Option>
                    <Select.Option value="Formation & workshop">Formation & workshop</Select.Option>
                    <Select.Option value="Transports">Transports</Select.Option>
                    <Select.Option value="Événements & loisirs">Événements & loisirs</Select.Option>
                    <Select.Option value="Culture">Culture</Select.Option>
                </Select>

                {/* Filtre par type d'offre */}
                <Select
                    className="filter-select-type"
                    value={filterType}
                    onChange={(value) => setFilterType(value)}
                    placeholder="Filtrer par type"
                    style={{ width: 200, marginBottom: '20px' }}
                >
                    <Select.Option value="">Tous les types</Select.Option>
                    <Select.Option value="REDUCTION">Réduction</Select.Option>
                    <Select.Option value="PROMOTION">Promotion</Select.Option>
                </Select>
                <Button className="add-offre-btn" onClick={() => handleOpenModal()} style={{ marginBottom: '8px' }}>
  <PlusCircleOutlined /> Ajouter Offre
</Button>
            </div>

            <Table
                className="offres-table"
                columns={[
                    { title: 'Titre', dataIndex: 'titre', key: 'titre' },
                    { title: 'Description', dataIndex: 'description', key: 'description' },
                    { title: 'Prix', dataIndex: 'prix', key: 'prix' },
                    { title: 'Catégorie ' ,dataIndex: 'categorie', key: 'categorie' },
                    { title: 'Prix après réduction', dataIndex: 'prix_apres_reduction', key: 'prix_apres_reduction' },
                    { title: 'Statut ', dataIndex: 'statut', key: 'statut' },
                 
                    { 
                        title: 'Date Fin', 
                        dataIndex: 'date_fin', 
                        key: 'date_fin', 
                        render: (text) => formatDate(text) 
                    },
                    {
                        title: 'Image',
                        dataIndex: 'image',
                        key: 'image',
                        render: (text, record) => (
                            record.image ? <img src={`http://localhost:4000/uploads/${record.image}`} alt="offre" style={{ width: 50, height: 50 }} /> : 'Aucune image'
                        )
                    },
                    {
                        title: 'Actions',
                        key: 'actions',
                        render: (text, record) => (
                            <>  <div className="action-buttons">
                                <Button className="edit-buttono" onClick={() => handleOpenModal(record)}>
                                <Pencil size={18} />
                                </Button>
                                <Button className="delete-buttono" onClick={() => handleDelete(record._id)}>
                                <Trash size={18} />
                                </Button></div> </>
                        ),
                    },
                ]}
                dataSource={Array.isArray(offres) ? offres : []}
                rowKey="_id"
                pagination={{
                    current: currentPage,
                    total: totalPages * 10,
                    onChange: (page) => dispatch(fetchOffres(page, 10, 'titre', 'asc', { categorie: filterCategorie, type: filterType, search: searchQuery })),
                }}
                loading={loading}
            />

<Modal 
    className="custom-modal"
    title={modalTitle}
    open={isModalVisible}
    onCancel={() => setIsModalVisible(false)}
    footer={[
        <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Annuler
        </Button>,
        <Button key="submit" type="primary" onClick={handleAddOrEdit}>
            {buttonText}
        </Button>
    ]}
>
    <Form layout="vertical">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item label="Titre">
                <Input name="titre" value={formData.titre} onChange={handleChange} />
            </Form.Item>
            <Form.Item label="Description">
                <Input name="description" value={formData.description} onChange={handleChange} />
            </Form.Item>
            <Form.Item label="Type">
                <Select name="type" value={formData.type} onChange={value => setFormData({ ...formData, type: value })}>
                    <Select.Option value="REDUCTION">Réduction</Select.Option>
                    <Select.Option value="PROMOTION">Promotion</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label="Prix">
                <Input name="prix" type="number" value={formData.prix} onChange={handleChange} />
            </Form.Item>

            {/* Afficher le champ "Réduction (%)" uniquement si le type est "REDUCTION" */}
            {formData.type === 'REDUCTION' && (
                <Form.Item label="Réduction (%)">
                    <Input name="pourcentage_reduction" type="number" value={formData.pourcentage_reduction} onChange={handleChange} />
                </Form.Item>
            )}

           

            <Form.Item label="Catégorie">
                <Select name="categorie" value={formData.categorie} onChange={value => setFormData({ ...formData, categorie: value })}>
                    <Select.Option value="Hotels & vacations">Hotels & vacations</Select.Option>
                    <Select.Option value="Shopping">Shopping</Select.Option>
                    <Select.Option value="Santé & bien-être">Santé & bien-être</Select.Option>
                    <Select.Option value="Restaurant & lounge">Restaurant & lounge</Select.Option>
                    <Select.Option value="Formation & workshop">Formation & workshop</Select.Option>
                    <Select.Option value="Transports">Transports</Select.Option>
                    <Select.Option value="Événements & loisirs">Événements & loisirs</Select.Option>
                    <Select.Option value="Culture">Culture</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item label="Date de début">
                <Input name="date_debut" type="date" value={formData.date_debut} onChange={handleChange} />
            </Form.Item>

            <Form.Item label="Date de fin">
                <Input name="date_fin" type="date" value={formData.date_fin} onChange={handleChange} />
            </Form.Item>

            <Form.Item label="Image">
                <Upload
                    customRequest={({ file, onSuccess }) => {
                        setFormData({ ...formData, image: file });
                        onSuccess();
                    }}
                    showUploadList={false}
                >
                    <Button icon={<UploadOutlined />}>Sélectionner une image</Button>
                </Upload>
            </Form.Item>
        </div>
    </Form>
</Modal>

        </div>
    );
};

export default OffreComponent;
