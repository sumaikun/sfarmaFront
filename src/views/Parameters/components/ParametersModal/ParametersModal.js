import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
//import  api  from '../../../../middleware/api'

const ParametersModal = props => {

  console.log("props",props)

  let formContent = ""

  const [species, setSpecies ] = useState([]);

  useEffect(() => {

    const getSpecies = async () => {

      /*const response = await api.getData("species") 

      let arrayData = [{label:"Especie",value:""}]
      console.log("species",response.data)
      response.data.forEach( data => arrayData.push({label:data.name,value:data._id}) )
      setSpecies(arrayData)*/ 
    }

    getSpecies()

  },[]); 


  const handleChange = event => {
  
    props.changeFormData(event.target.name,event.target.value)

  };

  switch(props.newButtonText)
  {
    case "Crear nueva especie":
      formContent = 
      <div>
        
        <TextField
          fullWidth
          label="Nombre Especie"
          value={props.formData.name}
          onChange={handleChange}
          name="name"   
        >
        </TextField>
        <TextField
          fullWidth
          label="Info adicional"
          value={props.formData.meta}
          onChange={handleChange}
          name="meta"    
        >
        </TextField>

      </div>
    
      break;
    case "Crear nueva raza":      

      formContent = <div>
        
        <TextField
          fullWidth
          label="Nombre Raza"
          value={props.formData.name}
          name="name"
          onChange={handleChange}   
        >
        </TextField>
        <TextField
          fullWidth
          label="Info adicional"
          value={props.formData.meta}
          name="meta"
          onChange={handleChange}       
        >
        </TextField>
        <TextField
                fullWidth
                margin="dense"
                name="species"                
                required
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                InputLabelProps={{ shrink: !!props.formData.species }}
                value={props.formData.species}  
                variant="outlined"
                onChange={handleChange}
              >
                {species.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
      
      </div>
      break;
    default:

      formContent = 
      <div>
        
        <TextField
          fullWidth
          label="Nombre Laboratorio"
          value={props.formData.name}
          onChange={handleChange}
          name="name"   
        >
        </TextField>
        <TextField
          fullWidth
          label="Info adicional"
          value={props.formData.meta}
          onChange={handleChange}
          name="meta"    
        >
        </TextField>

      </div>
      break;
  }


  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    //setOpen(true);
  };

  const handleClose = () => {    
    //setOpen(false);
    props.changeModalState(false)
    
  };

  const saveAction = () => {
    //setOpen(false);
    props.changeModalState(false)
    props.createButton()
  } 

  return (
    <div>
     
        {
            props.newButtonText ?
            <Button variant="contained" onClick={()=>{ props.changeModalState(true) }}  color="primary">
            {props.newButtonText}
            </Button> : 

            <Button variant="contained" onClick={()=>{ props.changeModalState(true) }}  color="primary">
            Crear nuevo laboratorio
            </Button>
        }
      
      <Dialog
        open={props.modalOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Ingresa el valor del nuevo parametro"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { formContent }
          </DialogContentText>
        </DialogContent>
        <DialogActions>          
          <Button onClick={saveAction} color="primary" autoFocus>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ParametersModal;