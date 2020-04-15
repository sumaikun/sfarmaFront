import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from '@material-ui/core';

import  api  from '../../../../middleware/api'

import Autocomplete from '@material-ui/lab/Autocomplete';



const useStyles = makeStyles(() => ({
  root: {}
}));

const FormDetails = props => {


  console.log("form details props",props)

  const { className, ...rest } = props;

  const classes = useStyles();

 

  const handleChange = event => {

    console.log(event,event.target.name,event.target.value)
  
    props.changeDetails(event.target.name,event.target.value)

  };

  const AutoCompleteChange = (event, values, name) => {

    console.log("autocomplete changed",event,values,name)
    
    if(values){
      props.changeDetails(name,values.value)
    }

  }
  

  const [userRoles, setUserRoles ] = useState([]);

  const [laboratories, setLaboratories ] = useState([]);
  

  useEffect(() => {  

    let mounted = true;

    console.log(mounted)


    const getData = async () => {
      
      let response = await api.getData("getPrestaShopDistributors") 
      let arrayData = []
      console.log(response.data)
      response.data.forEach( data => arrayData.push({label:data.name,value:data.id}) )
      if(mounted){
          setLaboratories(arrayData)
      }     
      
      response = await api.getData("userRoles") 

      arrayData = [{label:"",value:""}]
      console.log(response.data)
      response.data.forEach( data => arrayData.push({label:data,value:data}) )
      if(mounted){
        setUserRoles(arrayData)
      } 
    }

    

    //getRoles()
    if(mounted){      
      getData()
    } 

    return () => mounted = false;

  },[]); 


  const errors =  new Array(5)

  const rules = (key,value) =>{
    switch(key){
      case "name":

        errors[0] = value.length > 0 && value.length < 3 ?
         "El nombre debe tener mas de tres digitos" : false       

        return  errors[0]

      case "lastName":

        errors[1] = value.length > 0 && value.length < 3 ?
         "El apellido debe tener mas de tres digitos" : false  

        return  errors[1]
         
      case "email":

        errors[2] = value.length > 0 && ( !value.match(/\S+@\S+\.\S+/) ) ?
          "No es un correo valido":false
        
          return  errors[2]
    

        case "password":

          errors[3] = value.length > 0 && (  !value.match(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/) )  ?
          "La contraseña debe tener una mayuscula, una minuscula y tener al menos 8 dígitos":false
        
          return  errors[3]

        case "confirmPassword":      

          
          errors[4] = value.confirmPassword.length > 0 && value.password != value.confirmPassword ?
            "Las contraseñas deben coincidir":false         
          
          return  errors[4]


      default:
        return true
    } 
  }

  const saveUser = () =>{
    props.submitData(errors)
  }


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form
        autoComplete="off"
        noValidate
      >
        <CardHeader
          subheader="Ingresar la información del usuario"
          title="Usuario"
        />
        <Divider />
        <CardContent>
          <Grid  container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText={rules("name",props.userDetails.name)}
                error = {rules("name",props.userDetails.name)}            
                label="Nombre"
                margin="dense"
                name="name"
                onChange={handleChange}
                required
                value={props.userDetails.name}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText={rules("lastName",props.userDetails.lastName)}
                error = {rules("lastName",props.userDetails.lastName)}
                label="Apellido"
                margin="dense"
                name="lastName"
                onChange={handleChange}
                required
                value={props.userDetails.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText={rules("email",props.userDetails.email)}
                error = {rules("email",props.userDetails.email)}
                label="Correo electrónico"
                margin="dense"
                name="email"
                onChange={handleChange}
                required
                value={props.userDetails.email}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              
              <Autocomplete
                id="combo-box-demo"
                //searchText="example"
                options={laboratories}
                getOptionLabel={(option) => option.label}
                onChange={(event, values)=>AutoCompleteChange(event, values,"laboratory")}
                renderInput={(params) => <TextField {...params} label="Laboratorio"
                name="laboratory"
                variant="outlined" />}
                value={ laboratories.length > 0 ? laboratories[laboratories.findIndex( data => data.value === props.userDetails.laboratory )] :  "" }
                
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText={rules("password",props.userDetails.password)}
                error = {rules("password",props.userDetails.password)}
                label="Contraseña"
                margin="dense"
                name="password"
                onChange={handleChange}
                type="password"
                value={props.userDetails.password}               
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText={rules("confirmPassword",{ password:props.userDetails.password,confirmPassword:props.userDetails.confirmPassword})}
                error = {rules("confirmPassword",{ password:props.userDetails.password,confirmPassword:props.userDetails.confirmPassword})}
                label="Confirmar contraseña"
                margin="dense"
                name="confirmPassword"
                onChange={handleChange}
                type="password"
                value={props.userDetails.confirmPassword}                                
                variant="outlined"
              />
            </Grid>
           <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Rol de usuario"
                margin="dense"
                name="role"
                onChange={handleChange}
                required
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                InputLabelProps={{ shrink: !!props.userDetails.role }}
                value={props.userDetails.role}  
                variant="outlined"
              >
                {userRoles.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
          
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={saveUser}
          >
            Guardar
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

FormDetails.propTypes = {
  className: PropTypes.string
};

export default FormDetails;
