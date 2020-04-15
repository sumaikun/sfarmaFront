import React from 'react';

import  Minimal  from './layouts/Minimal';

import  Main  from './layouts/Main';

import  { SignIn,
     SignUp,
     Home,
     UserList,
     UsersForm,
     ProductForm,
     ProductList,
     NotFound }  from './views'

import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout }  from './components';

import { connect } from 'react-redux';

const Routes = (props) => {
    return (
    <Switch>
        <Redirect
          exact
          from="/"
          to="/home"
        />
        <RouteWithLayout
            component={SignIn}
            exact
            layout={Minimal}
            authenticated={true}
            path="/login"
        />

        <RouteWithLayout
            component={SignUp}
            exact
            layout={Minimal}
            authenticated={true}
            path="/signUp"
        />

        <RouteWithLayout
            component={Home}
            exact
            layout={Main}
            authenticated={true}
            path="/home"
        />

        <RouteWithLayout
            component={UserList}
            exact
            layout={Main}
            authenticated={true}
            path="/users"
        />

        <RouteWithLayout
            component={UsersForm}
            exact
            layout={Main}
            authenticated={true}
            path="/users/form"
        />

        <RouteWithLayout
            component={ProductList}
            exact
            layout={Main}
            authenticated={true}
            path="/products"
        />

        <RouteWithLayout
            component={ProductForm}
            exact
            layout={Main}
            authenticated={true}
            path="/products/form"
        />

        <RouteWithLayout
            component={NotFound}
            exact
            layout={Minimal}
            path="/not-found"
        />
        <Redirect to="/not-found" />


    </Switch>
  );
};


const mapStateToProps = state => {
    return {
      appState: state.app,  
    };
  }
  
  
export default  connect(mapStateToProps, null)(Routes);
