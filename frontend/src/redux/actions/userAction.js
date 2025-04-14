// redux/actions/userActions.js
import { getUsers, createUser, updateUser, deleteUser } from '../../services/userServices';

export const fetchUsers = (page, search, role, sortBy) => async (dispatch) => {
    try {
        const data = await getUsers(page, search, role, sortBy);
        dispatch({ type: 'FETCH_USERS_SUCCESS', payload: data });
    } catch (error) {
        dispatch({ type: 'FETCH_USERS_FAILURE', payload: error.message });
    }
};

export const addUser = (userData) => async (dispatch) => {
    try {
        const newUser = await createUser(userData);
        dispatch({ type: 'ADD_USER_SUCCESS', payload: newUser });
    } catch (error) {
        dispatch({ type: 'ADD_USER_FAILURE', payload: error.message });
    }
};

export const editUser = (id, userData) => async (dispatch) => {
    try {
        const updatedUser = await updateUser(id, userData);
        dispatch({ type: 'EDIT_USER_SUCCESS', payload: updatedUser });
    } catch (error) {
        dispatch({ type: 'EDIT_USER_FAILURE', payload: error.message });
    }
};

export const removeUser = (id) => async (dispatch) => {
    try {
        await deleteUser(id);
        dispatch({ type: 'REMOVE_USER_SUCCESS', payload: id });
    } catch (error) {
        dispatch({ type: 'REMOVE_USER_FAILURE', payload: error.message });
    }
};
