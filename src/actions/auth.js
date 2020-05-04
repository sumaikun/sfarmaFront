// import { CALL_API } from '../middleware/api'
import {
  LOGIN_SUCCESS,

  LOGOUT_SUCCESS
} from "../constants";
import api from "../middleware/api";
import Swal from 'sweetalert2'
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
        
        console.log(response)
        // Dispatch the success action

        if(response.data.user.role != "admin" && response.data.user.conditions != true)
        {
          Swal.fire({
            title: '¿Acepta los terminos y condiciones?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3f51b5',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, adelante!',
            cancelButtonText: 'No'
          }).then( async (result) => {
            if (result.value) {

              await api.getData("/updateConditions/"+response.data.user._id)
              dispatch(receiveLogin(response.data.user,response.data.token))           
            
            }
          })
        }else{
          dispatch(receiveLogin(response.data.user,response.data.token));
        }

        
        if(cb) { cb(response,false) }
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
