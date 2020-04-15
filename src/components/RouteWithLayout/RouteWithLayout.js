import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import SignIn  from  'views/SignIn';
import { connect } from 'react-redux';

class RouteWithLayout extends Component{

  constructor(props)
  {
    super(props)
     
  }



  render(){

    const { layout: Layout, component: Component,  authenticated, ...rest } = this.props;

    let view ;
  
    if(authenticated)
    {
      if(this.props.authState.token != null)
      {
        view =  matchProps => (
          <Layout style={{display: 'none' }}>
            <Component  {...matchProps} />
          </Layout>
        );
      }
      else{
        view =  () => (       
            <SignIn/>      
        );
      }   
  
    }else{
      view = matchProps => (
        <Layout style={{display: 'none' }}>
          <Component {...matchProps} />
        </Layout>
      );    

    }


    return (
      <Route
        {...rest}
        render={ view }
      />
    );
  }
};




const mapStateToProps = state => {
  return {
    authState: state.auth,  
  };
}

export default  connect(mapStateToProps, null)(RouteWithLayout);