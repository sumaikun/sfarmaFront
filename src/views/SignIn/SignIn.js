import React , { useState } from 'react';
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

import { withRouter } from 'react-router-dom';

import { connect } from "react-redux";

import { loginUser } from "actions/auth";

import Swal from 'sweetalert2'





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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignIn = (props) => {
  
  const classes = useStyles();

  const { history } = props;

  const [formState, setFormState] = useState({    
    values: {} 
  });

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      }      
    }));
  };

  const handleSignIn = event => {
    
    event.preventDefault()
    console.log("it is time to login")
    console.log(formState.values)

    props.loginUser(formState.values, ( success , error ) =>{
      if(success){
        history.push('/');
      }
      if(error){
        
        let errorText

        try {
          errorText = error.response.status === 401 ? 'Las credenciales no son validas, vuelva a intentarlo' : 'Hay un problema con el servidor'
        }
        catch(error) {
           errorText =  "Hay un problema de conexión al servidor"
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorText,          
        })
      }
    })
  
  };

  return (
    <Container component="main" maxWidth="xs" style={{marginTop: "4%", marginBottom: "4%"}} >
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Ingresar al sistema
        </Typography>
        <form className={classes.form}   onSubmit={handleSignIn}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="username"
            autoComplete="email"
            type="email"
            autoFocus
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Recuerdame"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}           
          >
            Ingresar
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                ¿ Olvidaste la contraseña ?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2" onClick={ () => props.history.push("/signUp") }>
                {"¿ No tienes una cuenta ? Registrarse"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
     
    </Container>
  );
}

const mapDispatchToProps = {
  loginUser,
 };
 
export default connect(null, mapDispatchToProps)(withRouter(SignIn));