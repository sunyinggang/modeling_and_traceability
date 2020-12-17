import {
  ADD_COUNT,
  SET_TITLE,
  MODEL_STEP_1,
  MODEL_STEP_2,
  MODEL_STEP_1_RESULT,
  MODEL_STEP_2_RESULT,
  MODEL_STEP_3,
  MODEL_STEP_3_RESULT,
  MODEL_STEP_4,
  MODEL_STEP_4_RESULT,
  TRACING_STEP_1_RESULT,
  TRACING_STEP_1,
  NEGOTIATE_STEP_1_RESULT,
  NEGOTIATE_STEP_2_RESULT,
} from './actionTypes';

export const addCount = count => ({
  type: ADD_COUNT,
  payload: {
    count,
  },
});

export const setTitle = barTitle => ({
  type: SET_TITLE,
  payload: {
    barTitle,
  },
});

export const modelStep1 = data => ({
  type: MODEL_STEP_1,
  payload: {
    data,
  },
});

export const modelStep1Result = data => ({
  type: MODEL_STEP_1_RESULT,
  payload: {
    data,
  },
});

export const modelStep2 = data => ({
  type: MODEL_STEP_2,
  payload: {
    data,
  },
});

export const modelStep2Result = data => ({
  type: MODEL_STEP_2_RESULT,
  payload: {
    data,
  },
});

export const modelStep3 = data => ({
  type: MODEL_STEP_3,
  payload: {
    data,
  },
});

export const modelStep3Result = data => ({
  type: MODEL_STEP_3_RESULT,
  payload: {
    data,
  },
});

export const modelStep4 = data => ({
  type: MODEL_STEP_4,
  payload: {
    data,
  },
});

export const modelStep4Result = data => ({
  type: MODEL_STEP_4_RESULT,
  payload: {
    data,
  },
});

export const tracingStep1 = data => ({
  type: TRACING_STEP_1,
  payload: {
    data,
  },
});

export const tracingStep1Result = data => ({
  type: TRACING_STEP_1_RESULT,
  payload: {
    data,
  },
});

export const negotiateStep1Result = data => ({
  type: NEGOTIATE_STEP_1_RESULT,
  payload: {
    data,
  },
});

export const negotiateStep2Result = data => ({
  type: NEGOTIATE_STEP_2_RESULT,
  payload: {
    data,
  },
});
