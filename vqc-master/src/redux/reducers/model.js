import {
  MODEL_STEP_1,
  MODEL_STEP_1_RESULT,
  MODEL_STEP_2,
  MODEL_STEP_2_RESULT,
  MODEL_STEP_3,
  MODEL_STEP_3_RESULT,
  MODEL_STEP_4,
  MODEL_STEP_4_RESULT,
} from '../actionTypes';

const initialState = {
  curStep: 1,
  step1: [],
  step1result: [],
  step2: [],
  step2result: [],
  step3: [],
  step3result: [],
  step4: [],
  step4result: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MODEL_STEP_1: {
      const { data } = action.payload;
      return {
        ...state,
        step1: data,
      };
    }
    case MODEL_STEP_1_RESULT: {
      const { data } = action.payload;
      return {
        ...state,
        step1result: data,
      };
    }
    case MODEL_STEP_2: {
      const { data } = action.payload;
      return {
        ...state,
        step2: data,
      };
    }
    case MODEL_STEP_2_RESULT: {
      const { data } = action.payload;
      return {
        ...state,
        step2result: data,
      };
    }
    case MODEL_STEP_3: {
      const { data } = action.payload;
      return {
        ...state,
        step3: data,
      };
    }
    case MODEL_STEP_3_RESULT: {
      const { data } = action.payload;
      return {
        ...state,
        step3result: data,
      };
    }
    case MODEL_STEP_4: {
      const { data } = action.payload;
      return {
        ...state,
        step4: data,
      };
    }
    case MODEL_STEP_4_RESULT: {
      const { data } = action.payload;
      return {
        ...state,
        step4result: data,
      };
    }
    default:
      return state;
  }
}
