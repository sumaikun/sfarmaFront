import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { connect } from 'react-redux';
import './heart.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  }
}));

function StickyFooter(props) {
  
  const classes = useStyles();

  return (
    <div className={classes.root} style={{display: props.appState.loading ? "none":"block"}} >
      <CssBaseline />
      <Container component="main" className={classes.main} maxWidth="sm">
        
        <Typography variant="h2" style={{textAlign:"center"}} component="h1" gutterBottom>
          Bienvenido a sistema de gestión de medicamentos
        </Typography>

        <div id="heartContainer">
          <div class="intheair">
            <div class="heart"> </div>
          </div>
        </div>        

        
      </Container>
      
    </div>
  );
}

const mapStateToProps = state => {
 
  return {
    appState: state.app,   
  };
}

export default  connect(mapStateToProps, {} )(StickyFooter);