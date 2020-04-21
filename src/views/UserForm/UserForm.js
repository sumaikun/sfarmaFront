import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import { FormProfile, FormDetails } from './components';

import { connect } from 'react-redux';

import { saveUser } from 'actions/users';

import { uploadFileToServer } from 'actions/app'

//import { prestashopClient } from 'middleware/prestashop'


import Swal from 'sweetalert2' 

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));



const UserForm = props => {
  const classes = useStyles();


  console.log("props user form",props.usersState.selectedUser)

  const [values, setValues] = useState({
    _id:  props.usersState.selectedUser._id || props.usersState.selectedUser.id,
    name: props.usersState.selectedUser.name,
    lastName: props.usersState.selectedUser.lastName,
    email: props.usersState.selectedUser.email,
    laboratory: props.usersState.selectedUser.laboratory,
    role: props.usersState.selectedUser.role,
    picture: props.usersState.selectedUser.picture ? props.usersState.selectedUser.picture : null,
    password: '',
    confirmPassword: '',
    file: null
  });

  /*const resource = prestashopClient.resource('manufacturers');


  resource.list().then((models) => {
    console.log("prestashop models",models)
  });*/




  const changeValues = (key,value) =>
  {

    console.log(key,value);
    setValues({
      ...values,
      [key]: value
    });
  
    console.log(values)
  }

  const submitData = (errors) => {
    
    //const user = values;

    const user = { ...values };

    console.log("user",user)

    if(props.usersState.selectedUser.id)
    {
      user._id = props.usersState.selectedUser.id
    }

    if(user.name === "" || user.email === "" ||  user.lastName === "" || user.role === "" || user.laboratory === "" ) 
    {
      return Swal.fire({
        icon: 'error',
        title: 'Espera',
        text: "Debe llenar todos los datos obligatorios para continuar",          
      })
    }

    for (var i = 0; i < errors.length; i++) {
        if(errors[i])
        {
          return Swal.fire({
            icon: 'error',
            title: 'Espera',
            text: "Existen errores de validación en el formulario",          
          })
        }
    }

    if(values.file != null)
    {
      console.log("send file")
      uploadFileToServer(values.file,(response,err)=>{
        if(response){
          values.picture = response.data.filename
          props.saveUser(values,(res,err)=>{
           
            if(res){
              return Swal.fire({
                icon: 'success',
                title: 'Bien',
                text: "Datos registrados",          
              })
            }

          })
        }else{
          return Swal.fire({
            icon: 'error',
            title: 'Espera',
            text: "Hubo un error subiendo el archivo",          
          })
        }
      })
    }
    else{

      console.log("user to save",values);

      props.saveUser(values,(res,err)=>{       
        
        if(res){
          return Swal.fire({
            icon: 'success',
            title: 'Bien',
            text: "Datos registrados",          
          })
        }      
        
      })
    }

  } 

  return (
    <div className={classes.root} style={{display: props.appState.loading ? "none":"block"}} >
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={4}
          md={6}
          xl={4}
          xs={12}
        >        
          <FormProfile  userDetails={values} changeDetails={changeValues} />
          
        </Grid>
        <Grid
          item
          lg={8}
          md={6}
          xl={8}
          xs={12}
        >      
          <FormDetails changeDetails={changeValues} laboratories={props.appState.laboratories}
           userDetails={values} submitData={submitData}  />
        </Grid>
      </Grid>
    </div>
  );
};


const mapStateToProps = state => {
 
  return {
    usersState: state.users,
    appState: state.app,   
  };
}


export default  connect(mapStateToProps, { saveUser  } )(UserForm);

