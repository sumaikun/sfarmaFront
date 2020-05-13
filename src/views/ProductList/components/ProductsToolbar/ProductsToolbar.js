import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

import { SearchInput } from 'components';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const ProductsToolbar = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const addFilterText = event => {
    //console.log("filter text",event.target.value)
    props.filteredProducts(event.target.value)
  }

  const handleChange = event => {
  
    props.changeDetails(event.target.name,event.target.value)

  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}  >    
        <FormControl component="fieldset" style={{marginTop:"50px"}}>
            <FormLabel component="legend">Tipo de vista:</FormLabel>
            <RadioGroup aria-label="viewMode" name="viewMode" 
              onChange={handleChange} value={props.viewMode} >
              
              <FormControlLabel value="list" control={<Radio />} 
                label="Lista" />

              <FormControlLabel value="minimal" control={<Radio />} 
                label="Miniatura" />
              
          </RadioGroup>
        </FormControl>
      </div>

      <br/><br/>

      <div className={classes.row}>
        <span className={classes.spacer} />

        <Button className={classes.importButton}  
          disabled={ props.selectedProduct === null } 
          style={{ display: props.viewMode === "list" ? "block":"none"}}
          onClick={props.approveButton}>Aprovar</Button>
        
        <Button className={classes.exportButton}
          disabled={ props.selectedProduct === null  } 
          style={{ display: props.viewMode === "list" ? "block":"none"}}
          onClick={props.cancelButton}>Rechazar</Button>

        <Button className={classes.importButton}  
          disabled={ props.selectedProduct === null } 
          style={{ display: props.viewMode === "list" ? "block":"none"}}
          onClick={props.editButton}>Editar</Button>
        
        <Button className={classes.exportButton}
          disabled={ props.selectedProduct === null  } 
          style={{ display: props.viewMode === "list" ? "block":"none"}}
          onClick={props.deleteButton}>Eliminar</Button>

        { //<Button className={classes.importButton}>Eliminar</Button> 
        }
        <Button className={classes.exportButton}  onClick={props.csvExport} >Exportar</Button>
        <Button
          color="primary"
          variant="contained"
          onClick={props.createButton}
        >
          Agregar Producto
        </Button>
      </div>
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="Buscar Producto"
          onChange={addFilterText}
        />
      </div>
    </div>
  );
};

ProductsToolbar.propTypes = {
  className: PropTypes.string
};

export default ProductsToolbar;
