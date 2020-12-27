import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import { FormFile, FormDetails } from './components';

import { connect } from 'react-redux';

import { saveProduct } from 'actions/products';

import { uploadFileToServer } from 'actions/app'

import { useLocation } from "react-router-dom";

import Swal from 'sweetalert2' 

import api from "middleware/api";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));



const ProductForm = props => {
  const classes = useStyles();

  const location = useLocation();

  console.log("props product form",props.productsState.selectedProduct)

  if(Object.keys(props.productsState.selectedProduct).length === 0 && props.productsState.selectedProduct.constructor === Object)
  {
    props.history.push("/products")
    
  }

  const [values, setValues] = useState({
    _id:  props.productsState.selectedProduct._id || props.productsState.selectedProduct.id,
    name: props.productsState.selectedProduct.name,
    description: props.productsState.selectedProduct.description, 
    externalBoxDesc: props.productsState.selectedProduct.externalBoxDesc,
    internalBoxDesc: props.productsState.selectedProduct.internalBoxDesc,
    subClassification: props.productsState.selectedProduct.subClassification,
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
    picture2: props.productsState.selectedProduct.picture2 ? props.productsState.selectedProduct.picture2 : null,
    picture3: props.productsState.selectedProduct.picture3 ? props.productsState.selectedProduct.picture3 : null,
    prepakCondition: props.productsState.selectedProduct.prepakCondition,
    customerBenefit: props.productsState.selectedProduct.customerBenefit,
    registerInvima: props.productsState.selectedProduct.registerInvima,
    sustanceCompose: props.productsState.selectedProduct.sustanceCompose,
    barCodeRegular: props.productsState.selectedProduct.barCodeRegular,
    amountByReference: props.productsState.selectedProduct.amountByReference,
    shooperClassification: props.productsState.selectedProduct.shooperClassification ? props.productsState.selectedProduct.shooperClassification : {}, 
    marketSegment: props.productsState.selectedProduct.marketSegment ? props.productsState.selectedProduct.marketSegment : {},
    rejectJutification: props.productsState.selectedProduct.rejectJutification ? props.productsState.selectedProduct.rejectJutification : "",
    file: null,
    defaultImageID: props.productsState.selectedProduct.defaultImageID || null,
    prestashopId: props.productsState.selectedProduct.prestashopId || null,
    unity: props.productsState.selectedProduct.unity,
    metaTitle: props.productsState.selectedProduct.metaTitle,
    metaDescription: props.productsState.selectedProduct.metaDescription,
    metaKeywords: props.productsState.selectedProduct.metaKeywords,
    width: props.productsState.selectedProduct.width,
    height: props.productsState.selectedProduct.height,
    descriptionShort: props.productsState.selectedProduct.descriptionShort
  });

  const changeValues = (key,value) =>
  { 
    setValues({
      ...values,
      [key]: value
    });
  
    console.log(values)
  }

  const changeValuesWithProperty = (property,key,value) =>
  {
    setValues({
      ...values,
      [property]:{
        ...values[property],
        [key]:value
      }
    });
  
    console.log(values)
  }

  const submitData = async (errors) => {
    
    const product = values;

    product.laboratory = String(product.laboratory)
    
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

    if(product.name === ""  || product.description === "" || product.category === "") 
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

    console.log("picture2",product.picture2)

    if( typeof product.picture2 === "object" && product.picture2 != null )
    {
      console.log("is object")

      const formData = new FormData()

      formData.append('file', product.picture2)

      const file2 = await api.postData("fileUpload",formData)

      console.log(file2)

      product.picture2 = file2.data.filename

    }

    if( typeof product.picture3 === "object" && product.picture3 != null )
    {
      console.log("is object")

      const formData = new FormData()

      formData.append('file', product.picture3)

      const file3 = await api.postData("fileUpload",formData)

      console.log(file3)

      product.picture3 = file3.data.filename

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
            changeValuesWithProperty={changeValuesWithProperty}
            location={location}
            user={props.authState.user}
            productDetails={values} 
            laboratories={props.appState.laboratories}
            submitData={submitData}  />
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
