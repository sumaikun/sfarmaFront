import React, { useState , useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton, Menu, MenuItem, Divider, Typography } from '@material-ui/core';
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

  const [notifications2, setNotifications2] = useState([]);
   
  useEffect(() => { 

    if(props.authState.user.role === "admin")
    {

      let laboratoriesToNotify = []

      let dataTocheck = 0

      props.productsState.products.forEach( data => {
        
        console.log("product",data)

        if(!laboratoriesToNotify.includes(data.laboratory) && data.state != "sended" &&  data.state != "rejected")
        {
          laboratoriesToNotify.push(data.laboratory)  
        }

        if( data.state != "sended" &&  data.state != "rejected" )
        {
          dataTocheck += 1
        }

      })

      setNotifications({ laboratories: laboratoriesToNotify, count: dataTocheck })



    }

    if(props.authState.user.role != "admin")
    {

      let rejectsToNotify = 0

      props.productsState.products.forEach( product => { 
        if(product.user === props.authState.user._id && product.state === "rejected" )
        {
          rejectsToNotify += 1
        }
      })
      
      setNotifications2({ count: rejectsToNotify })

    }

  },[])

  const [open, setOpen] = useState(null);

  const [open2, setOpen2] = useState(null);

  const openMenu = (event) => {
    setOpen(event.currentTarget);
    console.log("open menu",open)
  };

  const openMenu2 = (event) => {
    setOpen2(event.currentTarget);
    console.log("open menu2",open2)
  };

  const closeMenu = () => {    
    setOpen(null)
    console.log("close menu",open)
  }

  const closeMenu2 = () => {    
    setOpen2(null)
    console.log("close menu2",open2)
  }

  const searchNews = (id) => {
    closeMenu()
    props.history.push({
      pathname: '/filteredProducts',
      state: { mode:"filterNew" , data: id }
    })
    window.location.reload()   
  }

  const searchRejectments = () => {
    closeMenu2()
    props.history.push({
      pathname: '/filteredProducts',
      state: { mode:"filterReject" }
    })
    window.location.reload() 
   
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
              <Typography style={{textAlign:"center",fontWeight:"bold",fontSize:"12px"}} >
                 Productos pendientes de verificación 
              </Typography>
              <Divider />
              { notifications.laboratories && notifications.laboratories.map(
                data => 
                  <MenuItem onClick={()=>searchNews(data)}>
                    { 
                      appState.laboratories.length > 0 ? 
                      appState.laboratories[appState.laboratories.findIndex( sdata => sdata.id === parseInt(data) )]?.name+" " : false
                    }  
                    <Badge style={{marginLeft:"10px"}} color="secondary" variant="dot">
                      <Typography>{props.productsState.products.filter( 
                          product => product.laboratory === data &&  product.state != "sended" &&  product.state != "rejected"
                        ).length  }</Typography>
                    </Badge>
                    
                  </MenuItem>
                )
              }
              
              
          </StyledMenu>

        
        {
          
          props.authState.user.role != "admin" ?

          <IconButton 
            color="inherit"
            onClick={openMenu2}
          >
            <Badge
              badgeContent={notifications2.count}
            >
              <NotificationsIcon />
            </Badge>            
          </IconButton>:
          false
        }

          <StyledMenu
              keepMounted
              open={Boolean(open2)}
              onClose={closeMenu2}
              anchorEl={open2}
              style={{marginRight:"250px"}}
            >
              <Typography style={{textAlign:"center",fontWeight:"bold",fontSize:"12px"}} >
                 Rechazos pendientes
              </Typography>
              <Divider />
              
              <MenuItem onClick={()=>searchRejectments()}>
                
                <Badge style={{marginLeft:"10px"}} color="secondary" variant="dot">
                  <Typography>Verificar Rechazos</Typography>
                </Badge>
                
              </MenuItem>           
              
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