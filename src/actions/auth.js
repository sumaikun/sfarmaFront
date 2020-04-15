// import { CALL_API } from '../middleware/api'
import {
  LOGIN_SUCCESS,

  LOGOUT_SUCCESS
} from "../constants";
import api from "../middleware/api";

//console.log("api",api)

// Login actions



function receiveLogin(user,token) {
  return {
    type: LOGIN_SUCCESS,   
    token: token,
    user: user
  };
}


export function loginUser(creds,cb = null) {

  console.log("got in function");

  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    //console.log("got dispatch");
    return api.login("auth", creds)
      .then(( response ) => {
        //console.log(response)
        // Dispatch the success action
        dispatch(receiveLogin(response.data.user,response.data.token));
        if(cb) { cb(true,false) }
      })
      .catch(err => { console.log("Error: ", err)
        if(cb) { cb(false,err) }
      });
  }
}



function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,   
  };
}

// Logs the user out
export function logoutUser() {
  return dispatch => {  
    dispatch(receiveLogout());
  };
}
