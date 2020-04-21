import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import Lock from '@material-ui/icons/Lock';
import Build from '@material-ui/icons/Build'
import Swal from 'sweetalert2'

import { Profile, SidebarNav} from './components';

import { connect } from "react-redux"

import { logoutUser } from "actions/auth"


const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const logoutUserAction = () => {
  
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Vas a salir del sistema!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, adelante!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        props.logoutUser();
        window.location.replace("/Home");
      }
    })
   
  }


  const classes = useStyles();

  const pages = [
    {
      title: 'Usuarios',
      href: '/users',
      icon: <PeopleIcon />
    }, 
    {
      title: 'Productos',
      href: '/products',
      icon: <ShoppingBasketIcon />
    },
    {
      action: logoutUserAction,
      title: 'Cerrar sesión',
      icon: <Lock/>
    }
  ];

  if(props.authState.user.role != "admin")
  {
    delete pages[0]
  }

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
        {/*  <UpgradePlan /> */}
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

const mapStateToProps = state => {
 
  return {
    authState: state.auth,  
  };
}

const mapDispatchToProps = {
  logoutUser,
  //getUsers,
 };

export default connect( mapStateToProps , mapDispatchToProps )(Sidebar);
