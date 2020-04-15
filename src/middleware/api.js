import axios from 'axios'

import {
  SET_FETCHING,
  LOGOUT_SUCCESS
} from "../constants";

import Swal from 'sweetalert2' 

const BASE_URL = process.env.REACT_APP_SERVER_HOST

/* eslint-disable-next-line */
console.log("BASE URL",BASE_URL,process.env);

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: false,
  params: {} // do not remove this, its added to add params later in the config
})

// Add a request interceptor
instance.interceptors.request.use(function (config) {

  //console.log("global store",Window.Store.getState().auth); 

  Window.Store.dispatch({type:SET_FETCHING,payload:true})
  
  const { token } = Window.Store.getState().auth
  // eslint-disable-next-line no-console
  //console.log("token", token)
  if (token) {
    config.headers.common['Authorization'] = 'Bearer ' + token
    config.headers.common['Access-Control-Allow-Origin'] = '*'
  } else {
    // Use application/x-www-form-urlencoded for login
    config.headers.common['Content-Type'] = 'application/json'
  }
  return config
}, function (error) {
  // Do something with request error
  // eslint-disable-next-line no-console
  //console.log("front end error",error.config,"e",error.response) 

  
  return Promise.reject(error)
})

instance.interceptors.response.use((response) => {
   
     Window.Store.dispatch({type:SET_FETCHING,payload:false})

     return response;
  }, (error) => {

    Window.Store.dispatch({type:SET_FETCHING,payload:false})

    // eslint-disable-next-line no-console
    //console.log(error.config,error.message,error.config.url.includes("auth"));

    if( ( error.message.includes("401") ||  error.message.includes("403") ) 
        && error.config.url.includes("auth") === false )
    {
      Window.Store.dispatch({type:LOGOUT_SUCCESS})
      alert("Credenciales expiradas ,Debe volver a logearse");      
      window.setTimeout(function(){ window.location.reload(); }, 3000);
      
    }
    else{

      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "sucedio un error con el servidor",          
      })

    }

    return Promise.reject(error)
})

export default {
  getData (action) {
    let url = `${BASE_URL}`
    url += action
    /* eslint-disable-next-line */
    //console.log("app url",url);
    return instance.get(url)
  },
  postData (action, data) {
    let url = `${BASE_URL}`
    url += action
    return instance.post(url, data)
  },
  putData (action, data) {
    let url = `${BASE_URL}`
    url += action
    return instance.put(url, data)
  },
  deleteData (action) {
    let url = `${BASE_URL}`
    url += action
    return instance.delete(url)
  },
  login (action, data) {
    let url = `${BASE_URL}`
    url += action
    return instance.post(url, data)
  }
}
