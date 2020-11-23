import React, { useState , useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from '@material-ui/core';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import  api  from 'middleware/api'

import Autocomplete from '@material-ui/lab/Autocomplete'

import ImageInput from 'components/ImageInput'

import MedicineClassification from 'components/MedicineClassification'

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
  root: {}
}));

const FormDetails = props => {

  //console.log("props",props)

  const { className, location, ...rest } = props;

  const classes = useStyles(); 

  const handleChange = event => {
  
    props.changeDetails(event.target.name,event.target.value)

  };

  const [prepak, setPrepak] = React.useState(false);

  const handleCheck= (event) => {
    setPrepak(event.target.checked);
  };

  const AutoCompleteChange = (event, values, name) => {

    //console.log("autocomplete changed",event,values,name)
    
    if(values){
      props.changeDetails(name,values.value)
    }

  }

  const errors =  new Array(7)

  const rules = (key,value) =>{
    switch(key){

      case "name":

        errors[0] = value.length > 0 && value.length < 3 ?
         "El nombre debe tener mas de tres digitos" : false       

        return  errors[0]

      case "contraIndications":

        errors[1] = value.length > 0 && value.length < 10 ?
        "Las contraindicaciones deben tener mas de 10 dígitos":false

        return  errors[1]
         
      case "description":

        errors[2] = value.length > 0 && value.length < 10 ?
          "La descripción debe tener mas de 10 dígitos":false
        
          return  errors[2]

      case "administrationWay":

        errors[3] = value.length > 0 && value.length < 5 ?
          "La forma de administración debe tener mas de 5 dígitos":false
        
          return  errors[3]

      case "indications":

        errors[4] = value.length > 0 && value.length < 10 ?
          "Las indicaciones deben tener mas de 10 dígitos":false
        
          return  errors[4]

      case "contraIndications":

        errors[5] = value.length > 0 && value.length < 10 ?
          "Las contra indicaciones deben tener mas de 10 dígitos":false
        
          return  errors[5]

      case "precautions":

        errors[6] = value.length > 0 && value.length < 10 ?
          "Las precauciones deben tener mas de 10 dígitos":false
        
          return  errors[6]

      case "rejectJutification":

        errors[7] = value.length > 0 && value.length < 10 ?
          "Las precauciones deben tener mas de 10 dígitos":false
        
          return  errors[7]          

      default:
        return true
    } 
  }

  const saveUser = () =>{
    props.submitData(errors)
  }

  const [laboratories, setLaboratories ] = useState([]);

  const [ categories, setCategories ] = useState([]);

  useEffect(() => {  

      let mounted = true;
      
      const getData = async () => { 

        let arrayData = []

        props.laboratories.forEach( data => arrayData.push({label:data.name,value:data.prestashopId}) )
        setLaboratories(arrayData)
        
        let response = await api.getData("getPrestaShopProductcategories") 

        arrayData = [{label:"",value:""}]
        //console.log(response.data)
        response.data.forEach( data => arrayData.push({label:data.name,value:data.id}) )

        if(mounted){      
          setCategories(arrayData)
        }


        //console.log("prepak condition",props.productDetails.prepakCondition)

        if(props.productDetails.prepakCondition != "" && props.productDetails.prepakCondition != null )
        {
          setPrepak(true) 
        }

      }

      if(mounted){      
        getData()
      } 
           

      return () => mounted = false;
      
  },[]);

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form
        autoComplete="off"
        noValidate
      >
        <CardHeader
          subheader={ location.state.mode !== "readOnly" ? "Ingresar la información del producto" : "Información"}
          title="Producto"
        />
        <Divider />
        <CardContent>
          <Grid  container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText={rules("name",props.productDetails.name)}
                error = {rules("name",props.productDetails.name)}            
                label="Nombre comercial del producto"
                margin="dense"
                name="name"
                onChange={handleChange}
                required
                value={props.productDetails.name}
                variant="outlined"
                disabled={location.state.mode === "readOnly"}
              />
            </Grid>  
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText={rules("description",props.productDetails.description)}
                error = {rules("description",props.productDetails.description)}            
                label="Descripción corta del producto"
                margin="dense"
                name="description"
                onChange={handleChange}
                required
                value={props.productDetails.description}
                variant="outlined"
                disabled={location.state.mode === "readOnly"}                
              />
              <span style={{display:"absolute", fontSize:"10px", height:"0px"}} >Especifique en una frase el tipo de producto y mencione sus componentes</span>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="EAN-13 (descripción externo caja):"
                margin="dense"
                name="externalBoxDesc"
                onChange={handleChange}
                required
                value={props.productDetails.externalBoxDesc}
                variant="outlined"
                disabled={location.state.mode === "readOnly"}
              />
            </Grid>  
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="EAN-13 - Descripción Interno (ejem. sobre)"
                margin="dense"
                name="internalBoxDesc"
                onChange={handleChange}
                required
                value={props.productDetails.internalBoxDesc}
                variant="outlined"
                disabled={location.state.mode === "readOnly"}
              />
            </Grid>


            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Código copidrogas"
                margin="dense"
                name="codeCopidrogas"
                onChange={handleChange}
                required
                value={props.productDetails.codeCopidrogas}
                variant="outlined"
                disabled={location.state.mode === "readOnly"}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Código interno del producto que utiliza el laboratorio o fabricante"
                margin="dense"
                name="internalManufacturerCode"
                onChange={handleChange}
                required
                value={props.productDetails.internalManufacturerCode}
                variant="outlined"
                disabled={location.state.mode === "readOnly"}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Sub Clasificación de laboratorio"
                margin="dense"
                name="subClassification"
                onChange={handleChange}
                required
                value={props.productDetails.subClassification}
                variant="outlined"
                disabled={location.state.mode === "readOnly"}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Tipo de medicamento:</FormLabel>
                <RadioGroup aria-label="medicineType" name="medicineType" 
                  value={props.productDetails.medicineType}
                  onChange={handleChange}>
                  
                  <FormControlLabel value="VL" control={<Radio />} 
                  disabled={location.state.mode === "readOnly"}  
                  label="Venta libre" />
                  <FormControlLabel value="PM" control={<Radio />}
                  disabled={location.state.mode === "readOnly"}
                  label="Prescripción Médica" />
                  <FormControlLabel value="F" control={<Radio />} 
                  disabled={location.state.mode === "readOnly"}
                  label="Fitoterapéuticos" />
                  <FormControlLabel value="CF" control={<Radio />} 
                  disabled={location.state.mode === "readOnly"}
                  label="Cadena de frío" />
                  <FormControlLabel value="RP" control={<Radio />} 
                  disabled={location.state.mode === "readOnly"}
                  label="Maneja regulación de precio" />
                 <FormControlLabel value="CON" control={<Radio />} 
                  disabled={location.state.mode === "readOnly"}
                  label="Controlado" />

                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Presentación"
                margin="dense"
                name="appearance"
                onChange={handleChange}
                required
                value={props.productDetails.appearance}
                variant="outlined"
                disabled={location.state.mode === "readOnly"}
              />
            </Grid>
            {
              props.user.role === "admin" ?

              <Grid item md={6} xs={12}>
                <Autocomplete
                id="combo-box-demo"
                //searchText="example"
                options={laboratories}
                getOptionLabel={(option) => option.label}
                onChange={(event, values)=>AutoCompleteChange(event, values,"laboratory")}
                renderInput={(params) => <TextField {...params} label="Laboratorio"
                name="laboratory"
                variant="outlined" />}
                disabled={location.state.mode === "readOnly"} 
                value={ laboratories.length > 0 ? laboratories[laboratories.findIndex( data => data.value === parseInt(props.productDetails.laboratory) )] :  "" }
                />              
              </Grid> :
                false
            } 

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Dimensiones:"
                margin="dense"
                name="dimens"
                onChange={handleChange}
                required
                value={props.productDetails.dimens}
                variant="outlined"  
                disabled={location.state.mode === "readOnly"}              
              />
              <span style={{display:"absolute", fontSize:"10px", height:"0px"}} >Largo x Ancho x Alto</span>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Peso:"
                margin="dense"
                name="weight"
                onChange={handleChange}
                required
                value={props.productDetails.weight}
                variant="outlined"
                disabled={location.state.mode === "readOnly"}
              />
            </Grid>  

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Cantidad Medida:"
                margin="dense"
                name="amountSized"
                onChange={handleChange}
                required
                value={props.productDetails.amountSized}
                variant="outlined"
                disabled={location.state.mode === "readOnly"}
              />
            </Grid>  

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Unidad de Medida:"
                margin="dense"
                name="measureUnit"
                onChange={handleChange}
                required
                value={props.productDetails.measureUnit}
                variant="outlined"    
                disabled={location.state.mode === "readOnly"}            
              />
              <span style={{display:"absolute", fontSize:"10px", height:"0px"}} >Ml, Mg, g, etc.</span>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText={rules("indications",props.productDetails.indications)}
                error = {rules("indications",props.productDetails.indications)}
                label="Indicaciones:"
                margin="dense"
                name="indications"
                onChange={handleChange}
                required
                value={props.productDetails.indications}
                variant="outlined"
                multiline
                rows={3}   
                disabled={location.state.mode === "readOnly"}             
              />           
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText={rules("contraIndications",props.productDetails.contraIndications)}
                error = {rules("contraIndications",props.productDetails.contraIndications)}            
                label="Contraindicaciones:"
                margin="dense"
                name="contraIndications"
                onChange={handleChange}
                required
                value={props.productDetails.contraIndications}
                variant="outlined"
                multiline
                rows={3}      
                disabled={location.state.mode === "readOnly"}          
              />           
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText={rules("precautions",props.productDetails.precautions)}
                error = {rules("precautions",props.productDetails.precautions)}            
                label="Precauciones:"
                margin="dense"
                name="precautions"
                onChange={handleChange}
                required
                value={props.productDetails.precautions}
                variant="outlined"
                multiline
                rows={3}      
                disabled={location.state.mode === "readOnly"}          
              />           
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText={rules("administrationWay",props.productDetails.administrationWay)}
                error = {rules("administrationWay",props.productDetails.administrationWay)}            
                label="Vía de Administración:"
                margin="dense"
                name="administrationWay"
                onChange={handleChange}
                required
                value={props.productDetails.administrationWay}
                variant="outlined"
                disabled={location.state.mode === "readOnly"}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Categoria producto"
                margin="dense"
                name="category"
                onChange={handleChange}
                required
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}               
                variant="outlined"
                disabled={location.state.mode === "readOnly"}
                value={props.productDetails.category}
              >
                {categories.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>  
            
            <Grid item md={3} xs={6}> 
                <FormControlLabel
                control={<Checkbox checked={prepak} onChange={handleCheck} name="checkedA" />}
                label="¿tiene condición de prepak?" 
                />
            </Grid>    
            
            {
              prepak ?  

              <Grid item md={3} xs={6}> 
                <FormControl component="fieldset">
                  <FormLabel component="legend"></FormLabel>
                    <RadioGroup aria-label="prepakCondition" name="prepakCondition" 
                      value={props.productDetails.prepakCondition}
                      onChange={handleChange}>
                      
                      <FormControlLabel value="KIT" control={<Radio />} 
                      disabled={location.state.mode === "readOnly"}  
                      label="Kit" />
                      <FormControlLabel value="AM" control={<Radio />}
                      disabled={location.state.mode === "readOnly"}
                      label="Amarre" />
                      <FormControlLabel value="OCC" control={<Radio />} 
                      disabled={location.state.mode === "readOnly"}
                      label="Oferta cliente consumidor" />
                      <FormControlLabel value="ODC" control={<Radio />} 
                      disabled={location.state.mode === "readOnly"}
                      label="Oferta distribuidora comerciante" />
                    </RadioGroup>
                 </FormControl>
              </Grid>
              : false   

            }

            {
              prepak ?  

              <Grid item md={6} xs={12}> 
                <TextField
                  fullWidth
                  label="Código de barras de producto regular:"
                  margin="dense"
                  name="barCodeRegular"
                  onChange={handleChange}
                  value={props.productDetails.barCodeRegular}
                  variant="outlined"
                  disabled={location.state.mode === "readOnly"}
                />
              </Grid>
              : false   

            }

            {
              prepak ?  

              <Grid item md={6} xs={12}> 
                <TextField
                  fullWidth
                  label="Cantidad por referencia incluida:"
                  margin="dense"
                  name="amountByReference"
                  type="number"
                  onChange={handleChange}
                  value={props.productDetails.amountByReference}
                  variant="outlined"
                  disabled={location.state.mode === "readOnly"}
                />
              </Grid>
              : false   

            }

            <Grid item md={6} xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Beneficios al cliente:</FormLabel>
                <RadioGroup aria-label="customerBenefit" name="customerBenefit" 
                  value={props.productDetails.customerBenefit}
                  onChange={handleChange}>
                  
                  <FormControlLabel value="PL" control={<Radio />} 
                  disabled={location.state.mode === "readOnly"}  
                  label="Pague 2 lleve 3" />
                  <FormControlLabel value="DP" control={<Radio />}
                  disabled={location.state.mode === "readOnly"}
                  label="Descuento progresivo" />
                  <FormControlLabel value="CE" control={<Radio />} 
                  disabled={location.state.mode === "readOnly"}
                  label="Condición especial" />
                  <FormControlLabel value="PR" control={<Radio />} 
                  disabled={location.state.mode === "readOnly"}
                  label="Plan Recambio" />
                  <FormControlLabel value="NA" control={<Radio />} 
                  disabled={location.state.mode === "readOnly"}
                  label="No Aplica" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Registro Invima:"
                margin="dense"
                name="registerInvima"
                onChange={handleChange}
                required
                value={props.productDetails.registerInvima}
                variant="outlined"
                disabled={location.state.mode === "readOnly"}
              />
            </Grid>  

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Sustancia o compuesto:"
                margin="dense"
                name="sustanceCompose"
                onChange={handleChange}
                required
                value={props.productDetails.sustanceCompose}
                variant="outlined"
                disabled={location.state.mode === "readOnly"}
              />
            </Grid>

            <Grid item md={6} xs={12}></Grid>

            <Divider />  

            <Grid item md={6} xs={12}>
              <ImageInput picture={props.productDetails.picture2} property="picture2"  
              changeDetails={props.changeDetails}  
              location={location}  />
            </Grid>

            <Grid item md={6} xs={12}>
              <ImageInput picture={props.productDetails.picture3} property="picture3"  
              changeDetails={props.changeDetails}  
              location={location} />
            </Grid>

            <Grid item md={6} xs={12}>
              <ExpansionPanel>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>Segmento del mercado</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  
                  <MedicineClassification 
                  location={location}
                  instructions={"A continuación ponga información adicional de quien utiliza o consume el producto."}
                  property="shooperClassification"
                  changeValuesWithProperty={props.changeValuesWithProperty}  
                  productDetails={props.productDetails}
                  />                
                  
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>


            <Grid item md={6} xs={12}>
              <ExpansionPanel>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>Clasificación de shooper</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <MedicineClassification 
                    location={location}
                    instructions={"A continuación ponga información adicional de quien compra el producto."}
                    property="marketSegment"
                    changeValuesWithProperty={props.changeValuesWithProperty}
                    productDetails={props.productDetails}  
                    />           
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>

            {
              props.user.role === "admin" ?
                <Grid item md={6} xs={12}>
                  <TextField
                      fullWidth
                      helperText={rules("rejectJutification",props.productDetails.rejectJutification)}
                      error = {rules("rejectJutification",props.productDetails.rejectJutification)}                  
                      label="Justificación de rechazo:"
                      margin="dense"
                      name="rejectJutification"
                      onChange={handleChange}
                      required
                      value={props.productDetails.rejectJutification}
                      variant="outlined"
                      multiline
                      rows={3}      
                      disabled={location.state.mode === "readOnly"}          
                    />     
                </Grid> : null
            }
            
          </Grid>
          

        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={saveUser}
            style={{ display: location.state.mode !== "readOnly" ? "block":"none"}}
          >
            Guardar
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

FormDetails.propTypes = {
  className: PropTypes.string
};

export default FormDetails;
