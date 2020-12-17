import { TRACING_STEP_1, TRACING_STEP_1_RESULT } from '../actionTypes';

const initialState = {
  curStep: 0,
  step1: [],
  step1Result: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TRACING_STEP_1: {
      const { data } = action.payload;
      return {
        ...state,
        step1: data,
      };
    }
    case TRACING_STEP_1_RESULT: {
      const { data } = action.payload;
      return {
        ...state,
        step1Result: data,
      };
    }
    default:
      return state;
  }
}
