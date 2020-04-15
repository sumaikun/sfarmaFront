import React , { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
  LinearProgress
} from '@material-ui/core';
import { getInitials } from 'helpers';
import Swal from 'sweetalert2' 

const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 300,
    width: 300,
    flexShrink: 0,
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {   
    display: 'flex',
    justifyContent: 'center'
  }
}));

const FormFile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [values, setValues] = useState({   
    picture: props.productDetails.picture
  });

  

  const fileSubmit = e => {
    console.log("on file submit",e.target.files[0])

      const file = e.target.files[0]

      if(!file.type.includes("jpg") && !file.type.includes("png") 
      && !file.type.includes("gif") && !file.type.includes("jpeg") ){
      
        return    Swal.fire({
              icon: 'error',
              title: 'Espera',
              text: "Solo se permiten imagenes",          
          })
    }

    const reader = new FileReader();

    reader.addEventListener("load", function () {
      // convert image file to base64 string
      console.log(reader.result)
      setValues({ ...values, picture:reader.result  })
      props.changeDetails("file",file)
    }, false);

    const url = reader.readAsDataURL(file);

    //console.log("url",url)
    //setValues({ ...values, picture:e.target.files[0]  });
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.details}>
          <div>
            <Typography
              gutterBottom
              variant="h2"
            >
              { props.productDetails.name }
            </Typography>
           
            <Typography
              className={classes.dateText}
              color="textSecondary"
              variant="body1"
            >
              { props.productDetails.description }
            </Typography>

          </div>
          <Avatar
            className={classes.avatar}
            variant="rounded"
            src={ !values.picture || values.picture.includes('base64') ? values.picture:process.env.REACT_APP_SERVE_IMAGE+values.picture }
          >
            {getInitials(props.productDetails.name)}
          </Avatar>
        </div>
      
      </CardContent>
      <Divider />
      <CardActions className={classes.uploadButton}>

          <Button          
            color="primary"
            variant="text"
            component="label"
            type="submit"
          >
            Cambiar foto
            <input
              type="file"
              style={{ display: "none" }}
              onChange={fileSubmit}
            />
            
          </Button>
       
       
      </CardActions>
    </Card>
  );
};

FormFile.propTypes = {
  className: PropTypes.string
};

export default FormFile;
