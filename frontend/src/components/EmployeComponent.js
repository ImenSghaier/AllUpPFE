import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, addEmployee, importEmployees ,editEmployee ,removeEmployee} from "../redux/actions/employeAction";
import { Button, Modal, Table, Input, Select, Pagination, message } from "antd";
import Papa from "papaparse"; // Pour le traitement des fichiers CSV
import * as XLSX from "xlsx"; // Pour le traitement des fichiers Excel
import './EmployeComponent.css';

const EmployeComponent = () => {
  const dispatch = useDispatch();
  const { employees, error } = useSelector((state) => state.employe);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("nom");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [formData, setFormData] = useState({ nom: "", email: "", telephone: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [file, setFile] = useState(null);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleSortChange = (value) => setSortBy(value);

  // Filtrer et trier les employés
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

  const handleSubmit = () => {
    if (currentEmployee) {
      dispatch(editEmployee(currentEmployee._id, formData));
    } else {
      dispatch(addEmployee(formData));
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer cet employé ?",
      content: "Cette action est irréversible.",
      okText: "Oui",
      cancelText: "Annuler",
      onOk: () => dispatch(removeEmployee(id)),
    });
  };

  // Gérer le changement de fichier
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  // Importer un fichier CSV ou Excel
  const handleFileImport = () => {
    if (file) {
      if (file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // Traitement des fichiers Excel
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const employeesData = XLSX.utils.sheet_to_json(sheet);
          // Envoyer les données au backend
          dispatch(importEmployees(employeesData)); // Action pour importer les employés
        };
        reader.readAsBinaryString(file);
      } else {
        // Traitement des fichiers CSV
        Papa.parse(file, {
          complete: (result) => {
            const employeesData = result.data;
            // Envoyer les données au backend
            dispatch(importEmployees(employeesData)); // Action pour importer les employés
          },
          header: true, // Si ton fichier CSV a des en-têtes
        });
      }
    }
  };

  return (
    <div>
      <div className="header" style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <h1>Employés</h1>
        <Input placeholder="Rechercher..." onChange={handleSearch} />
        <Select defaultValue="nom" onChange={handleSortChange}>
          <Select.Option value="nom">Nom</Select.Option>
          <Select.Option value="email">Email</Select.Option>
        </Select>
        <Button type="primary" onClick={() => handleOpenModal()}>Ajouter Employé</Button>
        <Button>
          
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="fileInput"
          />
          <label htmlFor="fileInput" style={{ marginLeft: "10px" }}>Choisir un fichier</label>
        </Button>
        <Button onClick={handleFileImport}>Importer</Button>
      </div>

      <Table dataSource={paginatedEmployees} rowKey={(record) => record._id || record.email} pagination={false}>
        <Table.Column title="Nom" dataIndex="nom" key="nom" />
        <Table.Column title="Email" dataIndex="email" key="email" />
        <Table.Column title="Téléphone" dataIndex="telephone" key="telephone" />
        <Table.Column
          title="Action"
          key="action"
          className="action-column-e"
          render={(text, record) => (
            <>
              <Button onClick={() => handleOpenModal(record)}>Modifier</Button>
              <Button danger onClick={() => handleDelete(record._id)}>Supprimer</Button>
            </>
          )}
        />
      </Table>

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredEmployees.length}
        onChange={setCurrentPage}
      />

      <Modal
        title={currentEmployee ? "Modifier Employé" : "Ajouter Employé"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={handleSubmit}
        okButtonProps={{ disabled: !formData.nom || !formData.email || !formData.telephone }}
      >
        <Input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" />
        <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <Input name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Téléphone" />
      </Modal>
    </div>
  );
};

export default EmployeComponent;



// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchEmployees,
//   addEmployee,
//   editEmployee,
//   removeEmployee,
// } from "../redux/actions/employeAction";
// import { Button, Modal, Table, Input, Select, Pagination, message } from "antd";
// import './EmployeComponent.css';
// const EmployeComponent = () => {
//   const dispatch = useDispatch();
//   const { employees, error } = useSelector((state) => state.employe);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("nom");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentEmployee, setCurrentEmployee] = useState(null);
//   const [formData, setFormData] = useState({ nom: "", email: "", telephone: "" });
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;

//   useEffect(() => {
//     dispatch(fetchEmployees());
//   }, [dispatch]);

//   useEffect(() => {
//     if (error) {
//       message.error(error);
//     }
//   }, [error]);

//   const handleSearch = (e) => setSearchTerm(e.target.value);
//   const handleSortChange = (value) => setSortBy(value);

//   // Vérifier que employees est bien un tableau avant de filtrer/trier
//   const filteredEmployees = (Array.isArray(employees) ? employees : [])
//     .filter((emp) =>
//       (emp.nom?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
//       (emp.email?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
//       (emp.telephone?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
//     )
//     .sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));

//   const paginatedEmployees = filteredEmployees.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const handleOpenModal = (employee = null) => {
//     setCurrentEmployee(employee);
//     setFormData(employee || { nom: "", email: "", telephone: "" });
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setCurrentEmployee(null);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = () => {
//     if (currentEmployee) {
//       dispatch(editEmployee(currentEmployee._id, formData));
//     } else {
//       dispatch(addEmployee(formData));
//     }
//     handleCloseModal();
//   };

//   const handleDelete = (id) => {
//     Modal.confirm({
//       title: "Êtes-vous sûr de vouloir supprimer cet employé ?",
//       content: "Cette action est irréversible.",
//       okText: "Oui",
//       cancelText: "Annuler",
//       onOk: () => dispatch(removeEmployee(id)),
//     });
//   };

//   return (
//     <div>
//       <div className="header" style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
//         <h1>Employés</h1>
//         <Input placeholder="Rechercher..." onChange={handleSearch} />
//         <Select  defaultValue="nom" onChange={handleSortChange}>
//           <Select.Option value="nom">Nom</Select.Option>
//           <Select.Option value="email">Email</Select.Option>
//         </Select>
//         <Button type="primary" onClick={() => handleOpenModal()}>
//           Ajouter Employé
//         </Button>
//       </div>

//       <Table dataSource={paginatedEmployees} rowKey={(record) => record._id || record.email} pagination={false}>
//         <Table.Column title="Nom" dataIndex="nom" key="nom" />
//         <Table.Column title="Email" dataIndex="email" key="email" />
//         <Table.Column title="Téléphone" dataIndex="telephone" key="telephone" />
//         <Table.Column
//           title="Action"
//           key="action"
//           className="action-column-e"
//           render={(text, record) => (
//             <>
//               <Button onClick={() => handleOpenModal(record)}>Modifier</Button>
//               <Button danger onClick={() => handleDelete(record._id)}>Supprimer</Button>
//             </>
//           )}
//         />
//       </Table>

//       <Pagination
//         current={currentPage}
//         pageSize={pageSize}
//         total={filteredEmployees.length}
//         onChange={setCurrentPage}
//       />

//       <Modal
//         title={currentEmployee ? "Modifier Employé" : "Ajouter Employé"}
//         open={isModalOpen}
//         onCancel={handleCloseModal}
//         onOk={handleSubmit}
//         okButtonProps={{ disabled: !formData.nom || !formData.email || !formData.telephone }}
//       >
//         <Input
//           name="nom"
//           value={formData.nom}
//           onChange={handleChange}
//           placeholder="Nom"
//         />
//         <Input
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           placeholder="Email"
//         />
//         <Input
//           name="telephone"
//           value={formData.telephone}
//           onChange={handleChange}
//           placeholder="Téléphone"
//         />
//       </Modal>
//     </div>
//   );
// };

// export default EmployeComponent;
