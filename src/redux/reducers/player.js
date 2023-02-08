import {
  SET_INIT_AGAIN,
  SET_ADD_SCORE,
  SET_LOGIN_DATA,
  SET_RIGHT_QUESTION,
} from '../actions/action';

const INITIAL_STATE = {
  email: '',
  name: '',
  score: 0,
  assertions: 0,
};

function loginDataReducers(state = INITIAL_STATE, action) {
  const { email, name } = action;
  switch (action.type) {
  case SET_LOGIN_DATA:
    return { ...state, email, name };
  case SET_ADD_SCORE:
    return {
      ...state,
      score: state.score + action.payload,
    };
  case SET_RIGHT_QUESTION:
    return {
      ...state,
      assertions: state.assertions + 1,
    };
  case SET_INIT_AGAIN:
    return {
      email: '',
      name: '',
      score: 0,
      assertions: 0,
    };
  default:
    return state;
  }
}
export default loginDataReducers;
