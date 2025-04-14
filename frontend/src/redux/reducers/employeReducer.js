import {
    FETCH_EMPLOYEES_SUCCESS,
    FETCH_EMPLOYEES_ERROR,
    ADD_EMPLOYEE_SUCCESS,
    ADD_EMPLOYEE_ERROR,
    IMPORT_EMPLOYEES_SUCCESS,
    IMPORT_EMPLOYEES_ERROR,
    UPDATE_EMPLOYEE_SUCCESS,
    UPDATE_EMPLOYEE_ERROR,
    DELETE_EMPLOYEE_SUCCESS,
    DELETE_EMPLOYEE_ERROR
} from "../actions/employeAction";

const initialState = {
    employees: [],
    error: null,
};

// ⚡ Reducer pour gérer les employés
export const employeReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_EMPLOYEES_SUCCESS:
            return { ...state, employees: action.payload, error: null };

        case FETCH_EMPLOYEES_ERROR:
            return { ...state, error: action.payload };

        case ADD_EMPLOYEE_SUCCESS:
            return { ...state, employees: [...state.employees, action.payload], error: null };

        case ADD_EMPLOYEE_ERROR:
            return { ...state, error: action.payload };

        case IMPORT_EMPLOYEES_SUCCESS:
            return { ...state, employees: [...state.employees, ...action.payload], error: null };

        case IMPORT_EMPLOYEES_ERROR:
            return { ...state, error: action.payload };

        case UPDATE_EMPLOYEE_SUCCESS:
            return {
                ...state,
                employees: state.employees.map(emp =>
                    emp._id === action.payload._id ? action.payload : emp
                ),
                error: null
            };

        case UPDATE_EMPLOYEE_ERROR:
            return { ...state, error: action.payload };

        case DELETE_EMPLOYEE_SUCCESS:
            return {
                ...state,
                employees: state.employees.filter(emp => emp._id !== action.payload),
                error: null
            };

        case DELETE_EMPLOYEE_ERROR:
            return { ...state, error: action.payload };

        default:
            return state;
    }
};




// import {
//     FETCH_EMPLOYEES_SUCCESS,
//     FETCH_EMPLOYEES_ERROR,
//     ADD_EMPLOYEE_SUCCESS,
//     ADD_EMPLOYEE_ERROR,
//     UPDATE_EMPLOYEE_SUCCESS,
//     UPDATE_EMPLOYEE_ERROR,
//     DELETE_EMPLOYEE_SUCCESS,
//     DELETE_EMPLOYEE_ERROR
// } from "../actions/employeAction";

// const initialState = {
//     employees: [],
//     error: null,
// };

// // ⚡ Reducer pour gérer les employés
// export const employeReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case FETCH_EMPLOYEES_SUCCESS:
//             return { ...state, employees: action.payload, error: null };

//         case FETCH_EMPLOYEES_ERROR:
//             return { ...state, error: action.payload };

//         case ADD_EMPLOYEE_SUCCESS:
//             return { ...state, employees: [...state.employees, action.payload], error: null };

//         case ADD_EMPLOYEE_ERROR:
//             return { ...state, error: action.payload };

//         case UPDATE_EMPLOYEE_SUCCESS:
//             return {
//                 ...state,
//                 employees: state.employees.map(emp => 
//                     emp._id === action.payload._id ? action.payload : emp
//                 ),
//                 error: null
//             };

//         case UPDATE_EMPLOYEE_ERROR:
//             return { ...state, error: action.payload };

//         case DELETE_EMPLOYEE_SUCCESS:
//             return {
//                 ...state,
//                 employees: state.employees.filter(emp => emp._id !== action.payload),
//                 error: null
//             };

//         case DELETE_EMPLOYEE_ERROR:
//             return { ...state, error: action.payload };

//         default:
//             return state;
//     }
// };
