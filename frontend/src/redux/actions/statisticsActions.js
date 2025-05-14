// redux/actions/statisticsActions.js
import statisticsService from '../../services/statisticsService';

export const fetchStatistics = () => async (dispatch, getState) => {
  try {
    dispatch({ type: 'STATISTICS_REQUEST' });

    const {
      auth: { userInfo }
    } = getState();

    const data = await statisticsService.getStatistics(userInfo.token);

    dispatch({ type: 'STATISTICS_SUCCESS', payload: data });
  } catch (error) {
    dispatch({
      type: 'STATISTICS_FAIL',
      payload: error.response?.data?.message || error.message
    });
  }
};
