import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { Grid, TextField, Button } from '@material-ui/core';
import { ParametersTable, ParametersModal } from "./components"
//import  api  from '../../middleware/api'
//import { getParameters, saveParameter, getParameter, deleteParameter } from 'actions/parameters'
import Swal from 'sweetalert2'

const useStyles = theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  pagination: {
    marginTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});

class Parameters extends Component{

  constructor(props){
    super(props)
    console.log("productlist props",props)
    this.state = {
      parametersTypes:[],
      headers:[],
      columns:[],
      data:[],
      formData:{},
      mode:"",
      modalOpen: false
    }   
  }

  async componentDidMount(){  

    
    this.createButton = this.createButton.bind(this)
    this.editButton = this.editButton.bind(this)
    this.deleteButton = this.deleteButton.bind(this)    

    this.leftPagination = this.leftPagination.bind(this)
    this.rightPagination = this.rightPagination.bind(this)

    this.csvExport = this.csvExport.bind(this)
  
    this.handleChange = this.handleChange.bind(this)

    this.changeFormData = this.changeFormData.bind(this)

    this.changeModalState = this.changeModalState.bind(this)

    //const response = await api.getData("parametersType") 

    //let arrayDataTypes = []
    //console.log(response.data)
    //response.data.forEach( data => arrayDataTypes.push({label:data,value:data}) )


    //this.setState({  ...this.state , parametersTypes:arrayDataTypes })

  
  }

  changeFormData = (key,value) =>{
    this.setState({  ...this.state , 
      formData:{ ...this.state.formData , [key]:value  } 
    })
  }

  changeModalState = (open) =>{
    this.setState({  ...this.state , 
      modalOpen:open 
    })
  }

  handleChange = event => {
  
    //console.log("event",event.target.value)
    
    switch (event.target.value) {
      case "Especie":
       

        this.props.getParameters(
          (success,error) =>{
          success ?
          this.setState({  ...this.state , headers:["Nombre especie","Info Extra","Fecha","Opciones"],
            columns:["name","meta","date","options"],
            newButtonText:"Crear nueva especie",
            mode:"species",
            data:this.props.parametersState.parameters
          }) : console.log(error)
        },"species")
 
        break;
      case "Raza":
        

        this.props.getParameters((success,error) =>{
          success ?
          this.setState({  ...this.state , headers:["Nombre raza","Especie","Info Extra","Fecha","Opciones"],
            columns:["name","species","meta","date","options"],
            newButtonText:"Crear nueva raza",
            mode:"breeds",
            data:this.props.parametersState.parameters
          }):console.log(error)
        },"breeds")
 
        break;
      default:
        break;    
    }

  };



  csvExport() {
      
    let arrData = this.state.products;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += [
      Object.keys(arrData[0]).join(";"),
      ...arrData.map(item => Object.values(item).join(";"))
    ]
      .join("\n")
      .replace(/(^\[)|(\]$)/gm, "");

    const data = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", data);
    link.setAttribute("download", "report.csv");
    link.click();
  }

  createButton(){
    console.log("formData",this.state.formData)



    switch(this.state.mode)
    {
      case "species":
        if(!this.state.formData.name)
        {
          return Swal.fire({
            icon: 'error',
            title: 'Espera',
            text: "Debe llenar todos los datos obligatorios para continuar (nombre)",          
          })
        }
      case "breeds":
        if(!this.state.formData.name || !this.state.formData.species)
        {
          return Swal.fire({
            icon: 'error',
            title: 'Espera',
            text: "Debe llenar todos los datos obligatorios para continuar (nombre y especie)",          
          })
        }
    }

    this.props.saveParameter(this.state.formData,(success,error)=>{
      if(success)
      {
        this.props.getParameters((success,error)=>{
          if(success){
            this.setState({...this.state, formData:{},
              data:this.props.parametersState.parameters})
          }
        },this.state.mode)
              
      }      
    },this.state.mode)
  }

  editButton(data){
    console.log("edit button",data)
    this.setState({ ...this.state, modalOpen:true, formData:data })  
  }

  deleteButton(data){
    console.log("delete Button",data);


    Swal.fire({
      title: '¿Estas seguro de eliminar el parametro?',
      text: "¡La información no podra recuperarse!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, adelante!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.props.deleteParameter(data,(success,error)=>{
          if(success){
            this.props.getParameters((success,error)=>{
              if(success){
                this.setState({...this.state, formData:{},
                  data:this.props.parametersState.parameters})
              }
            },this.state.mode)
          }
        },this.state.mode)
      }
    })
    
  }



  shouldComponentUpdate(nextProps, nextState) {
    //console.log("should update");
    return nextProps === this.props
  }

  leftPagination(){
    if(this.state.page > 0)
    {
      this.setState({
        ...this.state,
        page: this.state.page - 1
      })
    }    
  }

  rightPagination(){
    if( this.state.rowsPerPage * (this.state.page + 1) <  this.state.products.length )
    {
      this.setState({
          ...this.state,
          page: this.state.page + 1
      },()=>{
        //console.log("result state",this.state)
      })
    }    
  }



  render(){    
    const { classes } = this.props;

    //const { page , rowsPerPage } = this.state;

    return (
      <div className={classes.root}>

        <Grid
            container
            spacing={4}
        >        
            <Grid item  lg={12} md={12} xs={12}>
                <h1>Parametrización del sistema</h1>
            </Grid>
           
            <Grid item  lg={12} md={12} xs={12}>
              <TextField
                fullWidth
                label="Tipo de parametro"
                margin="dense"
                onChange={this.handleChange}
                name="parameter"             
                required
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}             
                variant="outlined"
              >
                  <option>Selecciona</option>
                  {this.state.parametersTypes.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item  lg={12} md={12} xs={12}>
              <ParametersTable headers={this.state.headers} 
                columns={this.state.columns}
                data={this.state.data}
                editButton = { this.editButton }
                deleteButton = { this.deleteButton }
                ></ParametersTable>
            </Grid>

            <Grid item  lg={12} md={12} xs={12}>              
              <ParametersModal
                formData = {this.state.formData}
                changeFormData = {this.changeFormData}
                newButtonText = { this.state.newButtonText }
                createButton = {this.createButton}
                modalOpen = {this.state.modalOpen}
                changeModalState = {this.changeModalState}
              />
            </Grid>          
            
        </Grid>
          
    
     

      </div>
    );
  }

}


const mapStateToProps = state => {
 
  return {
    parametersState: state.parameters
  };
}

Parameters.propTypes = {
  classes: PropTypes.object.isRequired,
};

const componentDefinition =  withStyles(useStyles)(Parameters);

//export default  connect(mapStateToProps, { getParameters, saveParameter, getParameter, deleteParameter } )(componentDefinition);

export default componentDefinition

