import React, { useState, useEffect }  from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Swal from 'sweetalert2'
import  api  from 'middleware/api'

import Autocomplete from '@material-ui/lab/Autocomplete'; 


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp(props) {

  const [values, setValues] = useState({ name:"", lastName:"", email:"", password:"", confirmPassword:"", laboratory:"" })


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


  const handleChange = event => {

    //console.log(event,event.target.name,event.target.value)

    setValues({
      ...values,
      [event.target.name]: event.target.value
    });   

  };

  const AutoCompleteChange = (event, complete, name) => {

    console.log("autocomplete changed",event,complete,name)
    
    if(values){
      setValues({
        ...values,
        [name]: complete.value
      });
      //props.changeDetails(name,values.value)
    }

  }

  const sendForm = event => {
    event.preventDefault()
    console.log("send form", values, errors.length)

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

    if(values.laboratory === "")
    {
      return Swal.fire({
        icon: 'error',
        title: 'Espera',
        text: "Debes poner un laboratorio valido",          
      })
    }

    const user = { ...values }

    delete user.confirmPassword

    api.postData("signUp",user).then(( response ) => {

      return Swal.fire({
        icon: 'success',
        title: 'Bien',
        text: "espera que el administrador habilite tu usario y podras ingresar",          
      })
     
    })
    .catch(err => { console.log("Error: ", err)
     
      return Swal.fire({
        icon: 'error',
        title: 'Espera',
        text: "Intentalo nueva, puede estar sucediendo un problema con el servidor",          
      })

    });

  }

  const classes = useStyles();

  const [laboratories, setLaboratories ] = useState([]); 


  useEffect(() => {  

    let mounted = true;

    console.log(mounted)


    const getData = async () => {

      console.log("getting data")
      
      let response = await api.getData("getPrestaShopDistributors") 
      let arrayData = []
      console.log(response.data)
      response.data.forEach( data => arrayData.push({label:data.name,value:data.id}) )
      if(mounted){
          setLaboratories(arrayData)
      }     
      
    }

    if(mounted){    
      console.log("lets get data")  
      getData()
    } 

    return () => mounted = false;

  },[]);


  return (
    <Container component="main" maxWidth="xs" style={{marginTop: "4%", marginBottom: "4%"}} >
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registrarse
        </Typography>
        <form className={classes.form} onSubmit={sendForm}  noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                helperText={rules("name",values.name)}
                error = {rules("name",values.name)} 
             
                name="name"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="Nombre"
                onChange={handleChange}
                autoFocus
                value={values.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                helperText={rules("lastName",values.lastName)}
                error = {rules("lastName",values.lastName)} 
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Apellido"
                name="lastName"
             
                onChange={handleChange}
                value={values.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                helperText={rules("email",values.email)}
                error = {rules("email",values.email)} 
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Correo electrónico"
                name="email"
                
                onChange={handleChange}
                value={values.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                helperText={rules("password",values.password)}
                error = {rules("password",values.password)} 
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
              
                onChange={handleChange}
                value={values.password}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                helperText={rules("confirmPassword",values)}
                error = {rules("confirmPassword",values)} 
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="confirmar contraseña"
                type="password"
                id="confirmPassword"
             
                onChange={handleChange}
                value={values.confirmPassword}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                  id="combo-box-demo"
                  //searchText="example"
                  options={laboratories}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, values)=>AutoCompleteChange(event, values,"laboratory")}
                  renderInput={(params) => <TextField {...params} label="Laboratorio"
                  name="laboratory"
                  variant="outlined" />}
                  value={ laboratories.length > 0 ? laboratories[laboratories.findIndex( data => data.value === values.laboratory )] :  "" }
                  
                />
            </Grid>
            
           
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Registrarse
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" variant="body2" onClick={ () => props.history.push("/login") } >
                ¿ Ya tienes una cuenta ? Ingresar
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
     
    </Container>
  );
}