import {
  SET_INIT_AGAIN,
  SET_ADD_SCORE,
  SET_LOGIN_DATA,
  SET_RIGHT_QUESTION,
} from './action';

export const setLoginData = (email, name) => ({
  type: SET_LOGIN_DATA,
  email,
  name,
});

export const setAddScore = (payload) => ({
  type: SET_ADD_SCORE,
  payload,
});

export const setRightQuestions = () => ({
  type: SET_RIGHT_QUESTION,
});

export const setInitAgain = () => ({
  type: SET_INIT_AGAIN,
});
