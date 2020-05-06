import {
    SET_USERS,
    ADD_USER,
    REMOVE_USER,
    SELECT_USER
  } from "../constants";
  import api from "middleware/api";
  import { User } from "models/User";  

  
  
  
  function setUsers(users) {
    return {
      type: SET_USERS,   
      users:users
    };
  }

  function addUser(user) {
    return {
      type: ADD_USER,   
      user:user
    };
  }

  function removeUser(user) {
    return {
      type: REMOVE_USER,   
      user:user
    };
  }

  function selectUser(user){
    return{
      type: SELECT_USER,   
      user:user
    }
  }
  
  
  export function getUsers(cb=null) {
    
    
    return dispatch => {
      return api.getData("users")
        .then(( response ) => {

          dispatch(setUsers(response.data ? response.data : []));
          
          if(cb) { cb(true,false) }
          
        })
        .catch(err => { console.log("Error: ", err)
          
          if(cb) { cb(false,true) }
        
      });
    }
  }


  export function saveUser(user,cb = null) {
    
    console.log("user to save",user)

    return dispatch => {
      
      if(user._id || user.id ){

        const id = user._id || user.id

        return api.putData("users/"+id,user)
        .then(( response ) => {

          //dispatch(addUser(user));
          
          if(cb) { cb(response,false) }
        
        })
        .catch(err => { console.log("Error: ", err)
          if(cb) { cb(false,err) }
        });
      }else{
        return api.postData("users",user)
        .then(( response ) => {

          //dispatch(addUser(user));
          console.log("post response",response)

          dispatch(selectUser(response.data));
          
          if(cb) { cb(response,false) }
        
        })
        .catch(err => { console.log("Error: ", err)
          if(cb) { cb(false,err) }
        });
      }      
      
    }
  }
  

  export function deleteUser(user,cb = null) {
  
    return dispatch => {
      return api.deleteData("users/"+user._id)
        .then(( response ) => {

          dispatch(removeUser(user));   
          
          if(cb) { cb(true,false) }
        
        })
        .catch(err => { console.log("Error: ", err)
          if(cb) { cb(false,true) }
        });
    }
  }

  export function getUser(id,cb = null) {
  
    return dispatch => {

      if(id)
      {
        return api.getData("users/"+id)
        .then(( response ) => {

          dispatch(selectUser(response.data));
          
          if(cb) { cb(true,false) }
        
        })
        .catch(err => { 
          console.log("Error: ", err) 

          if(cb) { cb(false,true) }          
        
        });
      }else{
        
        dispatch(selectUser(
          new User()
        ));
        if(cb) { cb(true,false) }
      
      }      
    }
  }
  
  
  