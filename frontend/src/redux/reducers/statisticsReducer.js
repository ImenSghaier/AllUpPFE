// redux/reducers/statisticsReducer.js
export const statisticsReducer = (state = {}, action) => {
    switch (action.type) {
      case 'STATISTICS_REQUEST':
        return { loading: true };
      case 'STATISTICS_SUCCESS':
        return { loading: false, data: action.payload };
      case 'STATISTICS_FAIL':
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  