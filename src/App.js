import React, { Component } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Routes from './Routes';
import './App.css';
import { connect } from 'react-redux';
import 'react-perfect-scrollbar/dist/css/styles.css';
//import './assets/index.scss';
import Loading from 'components/Loading'
//#00007c
import {
  SET_FETCHING,  
} from "./constants";

const browserHistory = createBrowserHistory();


class App extends Component{

  constructor(props){
    super(props)
    Window.Store.dispatch({type:SET_FETCHING,payload:false})
    Window.StopAutoFetching = false  
  }

  //shouldComponentUpdate(nextProps, nextState) {
    //console.log("should update");
    //return nextProps === this.props
  //}

  render(){
    return (
      <ThemeProvider theme={theme}>
        {
          this.props.appState.loading ?
          <Loading/> 
          :false
        }  
          <Router history={browserHistory}>
            <Routes />
          </Router>
        
      </ThemeProvider>    
    );  
  }

  
}

const mapStateToProps = state => {
  return {
    appState: state.app,  
  };
}


export default  connect(mapStateToProps, null)(App);
