import { SET_TITLE } from '../actionTypes';

const initialState = {
  barTitle: '车间生产异常溯源系统',
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_TITLE:
      const { barTitle } = action.payload;
      return {
        ...state,
        barTitle,
      };
    default:
      return state;
  }
}
