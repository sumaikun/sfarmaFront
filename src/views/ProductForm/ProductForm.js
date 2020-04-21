import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import { FormFile, FormDetails } from './components';

import { connect } from 'react-redux';

import { saveProduct } from 'actions/products';

import { uploadFileToServer } from 'actions/app'

import { useLocation } from "react-router-dom";

import Swal from 'sweetalert2' 

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));



const ProductForm = props => {
  const classes = useStyles();

  const location = useLocation();

  console.log("props product form",props.productsState.selectedProduct)

  const [values, setValues] = useState({
    _id:  props.productsState.selectedProduct._id || props.productsState.selectedProduct.id,
    name: props.productsState.selectedProduct.name,
    description: props.productsState.selectedProduct.description, 
    externalBoxDesc: props.productsState.selectedProduct.externalBoxDesc,
    internalBoxDesc: props.productsState.selectedProduct.internalBoxDesc,
    codeCopidrogas: props.productsState.selectedProduct.codeCopidrogas,
    internalManufacturerCode: props.productsState.selectedProduct.internalManufacturerCode,
    medicineType: props.productsState.selectedProduct.medicineType,
    appearance: props.productsState.selectedProduct.appearance,
    laboratory: props.productsState.selectedProduct.laboratory,
    dimens: props.productsState.selectedProduct.dimens,
    weight: props.productsState.selectedProduct.weight,
    measureUnit: props.productsState.selectedProduct.measureUnit,
    amountSized: props.productsState.selectedProduct.amountSized,
    indications: props.productsState.selectedProduct.indications,
    contraIndications: props.productsState.selectedProduct.contraIndications,
    precautions: props.productsState.selectedProduct.precautions,
    administrationWay: props.productsState.selectedProduct.administrationWay,
    category: props.productsState.selectedProduct.category,
    picture: props.productsState.selectedProduct.picture ? props.productsState.selectedProduct.picture : null,
    file: null
  });

  const changeValues = (key,value) =>
  {

    console.log(key,value);
    setValues({
      ...values,
      [key]: value
    });
  
    console.log(values)
  }

  const submitData = (errors) => {
    
    const product = values;

    if(props.productsState.selectedProduct.id)
    {
      product._id = props.productsState.selectedProduct.id
    }

    if(props.authState.user.role === "admin" && product.laboratory === "")
    {
      return Swal.fire({
        icon: 'error',
        title: 'Espera',
        text: "Debe llenar todos los datos obligatorios para continuar",          
      })

    }

    if(product.name === ""  || product.description === "" || product.cateogry === "") 
    {
      return Swal.fire({
        icon: 'error',
        title: 'Espera',
        text: "Debe llenar todos los datos obligatorios para continuar",          
      })
    }

    for (var i = 0; i < errors.length; i++) {
        if(errors[i])
        {
          return Swal.fire({
            icon: 'error',
            title: 'Espera',
            text: "Existen errores de validación en el formulario",          
          })
        }
    }

    if(values.file != null)
    {
      console.log("send file")
      uploadFileToServer(values.file,(response,err)=>{
        if(response){
          values.picture = response.data.filename
          props.saveProduct(values,(res,err)=>{
           
            if(res){
              return Swal.fire({
                icon: 'success',
                title: 'Bien',
                text: "Datos registrados",          
              })
            }

          })
        }else{
          return Swal.fire({
            icon: 'error',
            title: 'Espera',
            text: "Hubo un error subiendo el archivo",          
          })
        }
      })
    }
    else{

      console.log("product to save",values);

      props.saveProduct(values,(res,err)=>{
       
        
        if(res){
          return Swal.fire({
            icon: 'success',
            title: 'Bien',
            text: "Datos registrados",          
          })
        }
        
        
        
      })
    }

  } 

  return (
    <div className={classes.root} style={{display: props.appState.loading ? "none":"block"}} >
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={12}
          md={12}
          xl={12}
          xs={12}
        >        
          <FormFile  location={location} productDetails={values} changeDetails={changeValues} />
        </Grid>
        <Grid
          item
          lg={12}
          md={12}
          xl={12}
          xs={12}
        >      
          <FormDetails changeDetails={changeValues} 
           location={location}
           user={props.authState.user}
           productDetails={values} 
           laboratories={props.appState.laboratories} submitData={submitData}  />
        </Grid>
      </Grid>
    </div>
  );
};


const mapStateToProps = state => {
 
  return {
    productsState: state.products,
    appState: state.app,   
    authState: state.auth
  };
}


export default  connect(mapStateToProps, { saveProduct  } )(ProductForm);
