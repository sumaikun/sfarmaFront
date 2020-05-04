import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Divider,
  Avatar
} from '@material-ui/core';

import CreateIcon from '@material-ui/icons/Create';

import DeleteIcon from '@material-ui/icons/Delete';

import CheckIcon from '@material-ui/icons/Check';

import CancelIcon from '@material-ui/icons/Cancel';

import { getInitials } from 'helpers';

import Swal from 'sweetalert2'

const useStyles = makeStyles(theme => ({
  root: {},
  imageContainer: {
  
    margin: '0 auto',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '5px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 300,
    width: 350,
    flexShrink: 0,
    flexGrow: 0
  },
  image: {
    width: '100%'
  },
  statsItem: {
    display: 'flex',
    alignItems: 'center'
  },
  statsIcon: {
    color: theme.palette.icon,
    marginRight: theme.spacing(1),
    cursor: 'pointer'
  }
}));

const ProductCard = props => {
  const { className, product, ...rest } = props;

  console.log("props in card",props)

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.imageContainer}>
        <Avatar
            className={classes.avatar}
            src={process.env.REACT_APP_SERVE_IMAGE+product.picture}
            variant="rounded"
            onClick={()=>{
              console.log("product clicked")
              props.editButton(product._id,"readOnly")
            }}
          >
            {getInitials(product.name)}
          </Avatar>
         
        </div>
        <Typography
          align="center"
          gutterBottom
          variant="h4"
        >
          {product.name}
        </Typography>
        <Typography
          align="center"
          variant="body1"
        >
          {product.description}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <Grid
          container
          justify="space-between"
        >
          <Grid
            className={classes.statsItem}
            item
            onClick={()=>{
              props.editButton(product._id)
            }}
            style={{display: props.user.role === "admin" || product.user === props.user._id  ? "block":"none"}}
          >
            <CreateIcon className={classes.statsIcon} />
            <Typography
              display="inline"
              variant="body2"
            >
              Editar
            </Typography>
          </Grid>
          <Grid
            className={classes.statsItem}
            item
            style={{display: props.user.role === "admin" || product.user === props.user._id  ? "block":"none"}}
            onClick={()=>{
              console.log("product clicked to delete")
              props.deleteButton(product)
            }}
          >
            <DeleteIcon className={classes.statsIcon} />
            <Typography
              display="inline"
              variant="body2"             
            >
              Eliminar
            </Typography>
          </Grid>

          <Grid
            className={classes.statsItem}
            item
            onClick={()=>{
              props.approveButton(product)
            }}
            style={{ display: props.user.role === "admin"  ? 
              product.state === "" ?
              "block":"none":"none" 
            }}
          >
            <CheckIcon className={classes.statsIcon} />
            <Typography
              display="inline"
              variant="body2"
            >
              Aprobar
            </Typography>
          </Grid>

          <Grid
            className={classes.statsItem}
            item
            style={{ display: props.user.role === "admin"  ? 
              product.state === "" ?
              "block":"none":"none" 
            }}
            onClick={()=>{
              props.cancelButton(product)
            }}
          >
            <CancelIcon className={classes.statsIcon} />
            <Typography
              display="inline"
              variant="body2"              
            >
              Rechazar
            </Typography>
          </Grid>

          <Grid
            className={classes.statsItem}
            item
            onClick={()=>{
              props.resendAprov(product)
            }}
            style={{ display: product.state === "rejected" &&
              (props.user.role === "admin" || product.user === props.user._id)
              ?
              "block":"none" 
            }}
          >
            <CheckIcon className={classes.statsIcon} />
            <Typography
              display="inline"
              variant="body2"
            >
              Volver a enviar para aprobacion
            </Typography>
          </Grid>   

        </Grid>
      </CardActions>
      <Divider />
        
        <CardActions style={{justifyContent:"center"
        ,backgroundColor:"#000076"
        ,color:"white"
        ,display: product.state === "sended"  ? "flex":"none"}} >
          <Grid>
          <Typography style={{color:"white",fontWeight:"bold"}} > 
            Transferido
          </Typography>            
          </Grid>      
        </CardActions> 

        <CardActions onClick={()=>{ Swal.fire( product.rejectJutification ) }}
        style={{justifyContent:"center"
        ,backgroundColor:"#EA3F20"
        ,color:"white"
        ,display: product.state === "rejected"  ? "flex":"none"}} >
          <Grid>
            <Typography style={{color:"white",fontWeight:"bold"}} > 
              Rechazado
            </Typography>            
          </Grid>      
        </CardActions>

    </Card>
  );
};

ProductCard.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object.isRequired
};

export default ProductCard;
