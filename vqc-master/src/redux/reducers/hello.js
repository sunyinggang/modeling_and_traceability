import { ADD_COUNT } from '../actionTypes';

const initialState = {
  counter: 0,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_COUNT: {
      const { count } = action.payload;
      return {
        ...state,
        counter: state.counter + count,
      };
    }
    default:
      return state;
  }
}
