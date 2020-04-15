import {
    LOGIN_SUCCESS,
    // LOGIN_FAILURE,
    LOGOUT_SUCCESS
  } from "../constants";
  
  // The auth reducer. The starting state sets authentication
  // based on a token being in local storage. In a real app,
  // we would also want a util to check if the token is expired.
  export function auth(
    state = {
      user:null,
      token:null
    },
    action
  ) {
    switch (action.type) {

      case LOGIN_SUCCESS:
        return Object.assign({}, state, {
          user:action.user,
          token:action.token
        });

      case LOGOUT_SUCCESS:
        return Object.assign({}, state, {
          user:null,
          token:null
        });

      default:
        return state;


    }
  }
  