// redux/reducers/userReducer.js
const initialState = {
  users: [],
  totalUsers: 0,
  currentPage: 1,
  totalPages: 0,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
      case 'FETCH_USERS_SUCCESS':
          return {
              ...state,
              users: action.payload.users,
              totalUsers: action.payload.totalUsers,
              totalPages: action.payload.totalPages,
              currentPage: action.payload.currentPage,
          };
      case 'FETCH_USERS_FAILURE':
          return { ...state, error: action.payload };
      case 'ADD_USER_SUCCESS':
          return { ...state, users: [...state.users, action.payload] };
      case 'ADD_USER_FAILURE':
          return { ...state, error: action.payload };
      case 'EDIT_USER_SUCCESS':
          return {
              ...state,
              users: state.users.map((user) =>
                  user._id === action.payload._id ? action.payload : user
              ),
          };
      case 'EDIT_USER_FAILURE':
          return { ...state, error: action.payload };
      case 'REMOVE_USER_SUCCESS':
          return {
              ...state,
              users: state.users.filter((user) => user._id !== action.payload),
          };
          
      case 'REMOVE_USER_FAILURE':
          return { ...state, error: action.payload };
      default:
          return state;
  }
};

export default userReducer;
