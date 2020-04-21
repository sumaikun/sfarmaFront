import api from "../middleware/api";
import {
    SET_LABORATORIES
  } from "../constants";


export function uploadFileToServer(file,cb){

    const formData = new FormData();
    formData.append('file', file)

    return api.postData("fileUpload",formData)
        .then(response => {

            if(cb) { cb(response,false) }
        
        }).catch(err => { console.log("Error: ", err)
            
            if(cb) { cb(false,err) }
        
        });

}




function setLaboratories(laboratories) {
    return {
      type: SET_LABORATORIES,
      payload:laboratories
    };
  }


export function getLaboratories(cb = null) {
    
    return dispatch => {
      // We dispatch requestLogin to kickoff the call to the API
      //console.log("got dispatch");
      return api.getData("getPrestaShopDistributors")
        .then(( response ) => {
          //console.log(response)
          // Dispatch the success action
          dispatch(setLaboratories(response.data));
          if(cb) { cb(true,false) }
        })
        .catch(err => { console.log("Error: ", err)
          if(cb) { cb(false,err) }
        });
    }
  }