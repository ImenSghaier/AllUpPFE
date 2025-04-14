import { getEmployees, createEmployee, updateEmployee, deleteEmployee,importEmployeesFromFile } from "../../services/employeService";

// Types d'actions
export const FETCH_EMPLOYEES_SUCCESS = "FETCH_EMPLOYEES_SUCCESS";
export const FETCH_EMPLOYEES_ERROR = "FETCH_EMPLOYEES_ERROR";
export const ADD_EMPLOYEE_SUCCESS = "ADD_EMPLOYEE_SUCCESS";
export const ADD_EMPLOYEE_ERROR = "ADD_EMPLOYEE_ERROR";
export const UPDATE_EMPLOYEE_SUCCESS = "UPDATE_EMPLOYEE_SUCCESS";
export const UPDATE_EMPLOYEE_ERROR = "UPDATE_EMPLOYEE_ERROR";
export const DELETE_EMPLOYEE_SUCCESS = "DELETE_EMPLOYEE_SUCCESS";
export const DELETE_EMPLOYEE_ERROR = "DELETE_EMPLOYEE_ERROR";
export const IMPORT_EMPLOYEES_SUCCESS = "IMPORT_EMPLOYEES_SUCCESS";
export const IMPORT_EMPLOYEES_ERROR = "IMPORT_EMPLOYEES_ERROR";
// ⚡ Action : Récupérer les employés
export const fetchEmployees = () => async (dispatch) => {
    try {
        const employees = await getEmployees();
        dispatch({ type: FETCH_EMPLOYEES_SUCCESS, payload: employees });
    } catch (error) {
        dispatch({ type: FETCH_EMPLOYEES_ERROR, payload: error.message });
    }
};
// ⚡ Action : Importer des employés
export const importEmployees = (employeesData) => async (dispatch) => {
    try {
        const newEmployees = await importEmployeesFromFile(employeesData);
        dispatch({ type: IMPORT_EMPLOYEES_SUCCESS, payload: newEmployees });
    } catch (error) {
        dispatch({ type: IMPORT_EMPLOYEES_ERROR, payload: error.message });
    }
};

// ⚡ Action : Ajouter un employé
export const addEmployee = (employeeData) => async (dispatch) => {
    try {
        const newEmployee = await createEmployee(employeeData);
        dispatch({ type: ADD_EMPLOYEE_SUCCESS, payload: newEmployee });
    } catch (error) {
        dispatch({ type: ADD_EMPLOYEE_ERROR, payload: error.message });
    }
};

// ⚡ Action : Modifier un employé
export const editEmployee = (id, employeeData) => async (dispatch) => {
    try {
        const updatedEmployee = await updateEmployee(id, employeeData);
        dispatch({ type: UPDATE_EMPLOYEE_SUCCESS, payload: updatedEmployee });
    } catch (error) {
        dispatch({ type: UPDATE_EMPLOYEE_ERROR, payload: error.message });
    }
};

// ⚡ Action : Supprimer un employé
export const removeEmployee = (id) => async (dispatch) => {
    try {
        await deleteEmployee(id);
        dispatch({ type: DELETE_EMPLOYEE_SUCCESS, payload: id });
    } catch (error) {
        dispatch({ type: DELETE_EMPLOYEE_ERROR, payload: error.message });
    }
};
