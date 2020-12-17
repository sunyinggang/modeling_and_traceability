import {
  NEGOTIATE_STEP_1_RESULT,
  NEGOTIATE_STEP_2_RESULT,
} from '../actionTypes';

const initialState = {
  curStep: 1,
  step1Result: [],
  step2Result: { rounds: 1, t: 5 },
};

export default function(state = initialState, action) {
  switch (action.type) {
    case NEGOTIATE_STEP_1_RESULT: {
      const { data } = action.payload;
      return {
        ...state,
        step1Result: data,
      };
    }
    case NEGOTIATE_STEP_2_RESULT: {
      const { data } = action.payload;
      return {
        ...state,
        step2Result: data,
      };
    }
    default:
      return state;
  }
}
