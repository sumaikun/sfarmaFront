import React , { useState } from 'react';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

import {
    Grid,   
    TextField
  } from '@material-ui/core';

const MedicineClassification = props => { 

    const { location, property, productDetails,...rest } = props;

    const handleChange = event => {
        
        //console.log(props.property+"."+event.target.name,event.target.name,event.target.value)

        props.changeValuesWithProperty(props.property,event.target.name,event.target.value)

    };

  return (

    <Grid  container spacing={1}>
        <Grid item md={12} xs={12}>
        <Typography>
            { props.instructions }
        </Typography>
        </Grid>
      
  
        <Grid item md={12} xs={12}>
            <TextField
            fullWidth
            label="Rango de edad:"
            name="ageRange"
            onChange={handleChange}
            value={ productDetails[property].ageRange }
            margin="dense"
            variant="outlined"
            disabled={location.state.mode === "readOnly"}
            />
        </Grid>

        <Grid item md={12} xs={12}>
            <TextField
            fullWidth
            label="Genero"
            margin="dense"
            name="genre"
            onChange={handleChange}
            value={ productDetails[property].genre }
            select
            // eslint-disable-next-line react/jsx-sort-props
            SelectProps={{ native: true }}               
            variant="outlined"
            disabled={location.state.mode === "readOnly"}                   
            >
            <option></option>
            <option value="F" >Femenino</option>
            <option value="M">Masculino</option>
            <option value="B">Ambos</option>
            
            </TextField>
        </Grid>

        <Grid item md={12} xs={12}>
            <TextField
            fullWidth
            label="Nivel de ingresos"
            margin="dense"
            name="salary"
            onChange={handleChange}
            value={ productDetails[property].salary }
            select
            // eslint-disable-next-line react/jsx-sort-props
            SelectProps={{ native: true }}               
            variant="outlined"
            disabled={location.state.mode === "readOnly"}                   
            >
            <option></option>
            <option value="minimal" >Menos de 1 SMLV</option>
            <option value="2minimal" >De uno a 2 SMLV</option>
            <option value="3to5minimal">De 3 SMLV a 5 SMLV</option>
            <option value="+5minimal">Más de 5 SMLV</option>
            
            </TextField>
        </Grid>

        <Grid item md={12} xs={12}>
            <TextField
            fullWidth
            label="Nivel educativo"
            margin="dense"
            name="education"
            onChange={handleChange}
            value={ productDetails[property].education }
            select
            // eslint-disable-next-line react/jsx-sort-props
            SelectProps={{ native: true }}               
            variant="outlined"
            disabled={location.state.mode === "readOnly"}                   
            >
            <option></option>
            <option value="primary" >Primaria</option>
            <option value="secondary" >Secundaria</option>
            <option value="professional" >Profesional</option>
            <option value="master" >Master o doctorado</option>
            
            </TextField>
        </Grid>

        <Grid item md={12} xs={12}>
            <TextField
            fullWidth
            label="Estrato socioeconomico"
            margin="dense"
            name="stratus"
            onChange={handleChange}
            value={ productDetails[property].stratus }
            select
            // eslint-disable-next-line react/jsx-sort-props
            SelectProps={{ native: true }}               
            variant="outlined"
            disabled={location.state.mode === "readOnly"}                   
            >
            <option></option>
            <option value="stratus123" >Estrato 1,2,3</option>
            <option value="stratus4">Estrato 4</option>
            <option value="stratus56">Estrato 5,6</option>                        
            </TextField>
        </Grid>

        <Grid item md={12} xs={12}>
            <TextField
            fullWidth
            label="Estado civil"
            margin="dense"
            name="civilStatus"
            onChange={handleChange}
            value={ productDetails[property].civilStatus }
            select
            // eslint-disable-next-line react/jsx-sort-props
            SelectProps={{ native: true }}               
            variant="outlined"
            disabled={location.state.mode === "readOnly"}                   
            >
            <option></option>
            <option value="union" >Casado o unión libre</option>
            <option value="single" >Soltero</option>                    
            </TextField>
        </Grid>

        <Grid item md={12} xs={12}>
            <TextField
            fullWidth
            label="Familia"
            margin="dense"
            name="family"
            onChange={handleChange}
            value={ productDetails[property].family }
            select
            // eslint-disable-next-line react/jsx-sort-props
            SelectProps={{ native: true }}               
            variant="outlined"
            disabled={location.state.mode === "readOnly"}                   
            >
            <option></option>
            <option value="0" >Sin hijos</option>
            <option value="5yearsOld" >Con hijos menores de 5 años</option>
            <option value="10yearsOld" >Con hijos menores de 10 años</option>
            <option value="11to15yearsOld" >Con hijos entre los 11 a 15 años</option>
            <option value="more18yearsOld" >Con hijos mayores de 18 años</option>                    
            </TextField>
        </Grid>

        <Grid item md={12} xs={12}>
            <TextField
            fullWidth
            label="Perfil conductual"
            margin="dense"
            name="profile"
            onChange={handleChange}
            value={ productDetails[property].profile }
            select
            // eslint-disable-next-line react/jsx-sort-props
            SelectProps={{ native: true }}               
            variant="outlined"
            disabled={location.state.mode === "readOnly"}                   
            >
            <option></option>
            <option value="benefit" >Benecio que busca al comprar el producto</option>
            <option value="frequency" >Frecuencia de uso del producto</option>                 
            </TextField>
        </Grid>
    </Grid>
  );
};



export default MedicineClassification;
