import React, { useState , useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import logo from "../../../../images/sfarmaLogo.jpg"
import Swal from 'sweetalert2'


import { connect } from "react-redux"

import { logoutUser } from "actions/auth"

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));


const Topbar = props => {

  console.log("Topbar props",props)

  const { className, appState, onSidebarOpen, ...rest } = props;

  const classes = useStyles();

  const [notifications, setNotifications] = useState([]);


   
  useEffect(() => { 

    if(props.authState.user.role === "admin")
    {

      let laboratoriesToNotify = []

      let dataTocheck = 0

      props.productsState.products.forEach( data => {
        
        console.log("product",data)

        if(!laboratoriesToNotify.includes(data.laboratory) && data.state != "sended" )
        {
          laboratoriesToNotify.push(data.laboratory)  
        }

        if( data.state != "sended" )
        {
          dataTocheck += 1
        }

      })

      setNotifications({ laboratories: laboratoriesToNotify, count: dataTocheck })



    }

  },[])

  const [open, setOpen] = useState(null);

  const openMenu = (event) => {
    setOpen(event.currentTarget);
    console.log("open menu",open)
  };

  const closeMenu = () => {    
    setOpen(null)
    console.log("close menu",open)
  }

  const searchNews = (id) => {
    closeMenu()
    props.history.push({
      pathname: '/products',
      state: { mode:"filterNew" , data: id }
    })
  }

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

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <RouterLink to="/">
          <img
            style={{width:"50%"}}
            alt="Logo"
            src={ logo }
          />
        </RouterLink>
        <div className={classes.flexGrow} />

        

        {
          props.authState.user.role === "admin" ?

          <IconButton 
            color="inherit"
            onClick={openMenu}
          >
            <Badge
              badgeContent={notifications.count}
            >
              <NotificationsIcon />
            </Badge>            
          </IconButton>:
          false
        }
          
          
          <StyledMenu
              keepMounted
              open={Boolean(open)}
              onClose={closeMenu}
              anchorEl={open}
              style={{marginRight:"250px"}}
            >

              { notifications.laboratories && notifications.laboratories.map(
                data => 
                  <MenuItem onClick={()=>searchNews(data)}>
                    { 
                      appState.laboratories.length > 0 ? 
                      appState.laboratories[appState.laboratories.findIndex( sdata => sdata.id === parseInt(data) )].name+" " : false
                    }  
                    <Badge style={{marginLeft:"10px"}} color="secondary" variant="dot">
                      <Typography>{notifications.count}</Typography>
                    </Badge>
                    
                  </MenuItem>
                )
              }
              
              
          </StyledMenu>

        <Hidden mdDown>         

          <IconButton
            onClick={logoutUserAction}
            className={classes.signOutButton}
            color="inherit" 
          >
            <InputIcon />
          </IconButton>

        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>

      

      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

const mapStateToProps = state => {
 
  return {
    authState: state.auth,
    productsState: state.products,
    appState: state.app  
  };
}

const mapDispatchToProps = {
  logoutUser,
  //getUsers,
 };

export default connect( mapStateToProps , mapDispatchToProps )(Topbar);

//color: #000076;