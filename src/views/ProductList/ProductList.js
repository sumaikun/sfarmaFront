import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { IconButton, Grid, Typography } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { ProductsToolbar, ProductCard , ProductsTable } from './components';
import { connect } from 'react-redux';
//import { useLocation } from "react-router-dom";
import Swal from 'sweetalert2'
import { getProducts , getProduct, deleteProduct, saveProduct } from 'actions/products';
import { createProductPrestashop } from 'actions/app'
import * as XLSX from 'xlsx'
import api from 'middleware/api'

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

class ProductList extends Component{

  constructor(props){
    super(props)
    console.log("productlist props",props)
    this.state = {
      products:[],
      viewMode:"list"
    }   
  }

  componentDidMount(){   

    this.linkRef = React.createRef();
    
    this.createButton = this.createButton.bind(this)
    
    this.editButton = this.editButton.bind(this)
    this.deleteButton = this.deleteButton.bind(this)

    this.approveTableButton = this.approveTableButton.bind(this)
    this.cancelTableButton = this.cancelTableButton.bind(this)
    
    this.editTableButton = this.editTableButton.bind(this)
    this.deleteTableButton = this.deleteTableButton.bind(this)

    this.filteredProducts = this.filteredProducts.bind(this)
    this.addSelectedProduct = this.addSelectedProduct.bind(this)


    this.leftPagination = this.leftPagination.bind(this)
    this.rightPagination = this.rightPagination.bind(this)

    this.csvExport = this.csvExport.bind(this)


    this.cancelButton = this.cancelButton.bind(this)
    this.approveButton = this.approveButton.bind(this)

    this.resendAprov = this.resendAprov.bind(this)

    this.sendToApprove = this.sendToApprove.bind(this)

    this.initializeList = this.initializeList.bind(this)

    this.changeDetails = this.changeDetails.bind(this)

    this.handleInputChange = this.handleInputChange.bind(this)

    this.initializeList()
  
  }

  handleInputChange (event) {
    
    /*const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    const this2 = this
    this.setState({
      [name]: value
    })*/

    const target = event.target
    const name = target.name
    let hojas = []
    if (name === 'file') {
      let reader = new FileReader()
      reader.readAsArrayBuffer(target.files[0])
      reader.onloadend = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});

        workbook.SheetNames.forEach(function(sheetName) {
          // Here is your object
          var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          hojas.push({
            data: XL_row_object,
            sheetName
          })
        })

        console.log("hojas",hojas[0].data)

        if( hojas && !hojas[0].data)
        {
          Swal.fire({title:"Espera",icon:"warning",text:"La información debe estar en la primera hoja, solo esta se tiene en cuenta"})
        }
        else{

          let arrData = []
      
          hojas[0].data.forEach( product => {
            arrData.push({
              name:product["Nombre Comercial"],
              description:product["Descripcion"],
              externalBoxDesc:product["EAN-13 Desc Externo"],
              internalBoxDesc:product["EAN-13 Desc Interno"],
              codeCopidrogas:product["Código copidrogas"],
              internalManufacturerCode:product["Código interno"],
              subClassification:product["Subclasificación"],
              medicineType:product["Tipo de medicamento"],
              appearance:product["Presentación"],
              laboratory:product["Laboratorio"],
              dimens:product["Dimensiones"],
              weight:String(product["Peso"]),
              amountSized:String(product["Cantidad Medida"]),
              measureUnit:product["Unidad de medida"],
              indications:product["Indicaciones"],
              contraindications:product["ContraIndicaciones"],
              precautions:product["Precauciones"],
              administrationWay:product["Via de administración"],
              category:product["Categoría"],
              prepakCondition:product["Condición"],
              barCodeRegular:product["Código de barras regular"],
              amountByReference:String(product["Cantidad por referencia"]),
              customerBenefit:product["Beneficios al cliente"],
              registerInvima:product["Registro Invima"],
              sustanceCompose:product["Sustancia o compuesto"]
            })
          })


          api.postData("massiveUpload",arrData).then( data => {
            Swal.fire({icon:"success",text:"Información procesada"})
          }).catch( e => console.error(e) )
        }

        /*this2.setState({
          selectedFileDocument: target.files[0],
          hojas
        })*/
      }
    }
  } 

  changeDetails(key,value){
    this.setState({
      ...this.state,
     [key]:value
    })
  }

  initializeList(){

    if(this.props.history.location.state == null)
    {
      this.props.getProducts((success,error)=>{
        if(success)
        {
          this.setState({
            ...this.state,
            products:this.props.productsState.products,
            selectedProduct:null,
            page:0,
            rowsPerPage:6
          })
        }
        
      })
    }
    else{
      if(this.props.history.location.state.mode === "filterNew")
      {
        console.log("condition filtered")
        //const laboratory = this.props.history.location.state.data
        
        this.props.getProducts((success,error)=>{
          if(success)
          {
            this.setState({
              ...this.state,
              products:this.props.productsState.products.filter( data => data.laboratory === this.props.history.location.state.data && ( data.state === "" || data.state === "inShopToApprove" )),
              selectedProduct:null,
              page:0,
              rowsPerPage:6
            })
          }
        })        
      }

      if(this.props.history.location.state.mode === "filterReject")
      {
        this.props.getProducts((success,error)=>{
          if(success)
          {
            this.setState({
              ...this.state,
              products:this.props.productsState.products.filter( data =>  data.state === "rejected" && data.user === this.props.authState.user._id   ),
              selectedProduct:null,
              page:0,
              rowsPerPage:6
            })
          }
        })
      }

    }  
  }

  addSelectedProduct(id){

    let product = this.state.products.filter( product =>  product._id === id )[0]
    
    this.setState({
      ...this.state,
      selectedProduct:product,
    })

  }

  csvExport() {

    
    const getMedicamentType = (name) =>{
      switch(name){
        case "VL":
          return "Venta Libre" 
        case "PM":
          return "Prescripción Médica"
        case "F":
          return "Fitoterapéuticos"
        case "CF":
          return "Cadena de frío"
        case "RP":
          return "Maneja regulación de precio"
        case "CON":
          return "Controlado"
      }
    }

    const getPrepakCondition = (name) =>{
      switch(name){
        case "KIT":
          return "Kit" 
        case "AM":
          return "Amarre"
        case "OCC":
          return "Oferta cliente consumidor"
        case "ODC":
          return "Oferta distribuidora comerciante"        
      }
    }

    const getCustomerBenefit = (name) =>{
      switch(name){
        case "PL":
          return "Pague 2 lleve 3" 
        case "DP":
          return "Descuento progresivo"
        case "CE":
          return "Condición especial"
        case "PR":
          return "Plan Recambio"
        case "NA":
          return "No aplica"        
      }
    }

    let arrData = []
      
    this.state.products.forEach( product => {
      arrData.push({
        "Nombre Comercial":product.name,
        "Descripcion":product.description,
        "EAN-13 Desc Externo":product.externalBoxDesc,
        "EAN-13 Desc Interno":product.internalBoxDesc,
        "Código copidrogas":product.codeCopidrogas,
        "Código interno":product.internalManufacturerCode,
        "Subclasificación":product.subClassification,
        "Tipo de medicamento":getMedicamentType(product.medicineType),
        "Presentación":product.appearance,
        "Laboratorio":this.props.appState.laboratories.filter( lab =>  lab.prestashopId === parseInt(product.laboratory) )[0] ?
        this.props.appState.laboratories.filter( lab =>  lab.prestashopId === parseInt(product.laboratory) )[0].name : "",
        "Dimensiones":product.dimens,
        "Peso":product.weight,
        "Cantidad Medida":product.amountSized,
        "Unidad de medida":product.measureUnit,
        "Indicaciones":product.indications,
        "ContraIndicaciones":product.contraindications,
        "Precauciones":product.precautions,
        "Via de administración":product.administrationWay,
        "Categoría":product.category,
        "Invima": product.prepakCondition ? "SI":"NO",
        "Condición": getPrepakCondition(product.prepakCondition),
        "Código de barras regular":product.barCodeRegular,
        "Cantidad por referencia":product.amountByReference,
        "Beneficios al cliente":getCustomerBenefit(product.customerBenefit),
        "Registro Invima":product.registerInvima,
        "Sustancia o compuesto":product.sustanceCompose
      })
    })

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
    console.log("create Button");
    this.props.getProduct(null)
    this.props.history.push({
      pathname: '/products/form',
      state: { mode:null }
    })
  }

  editButton(id,mode = null){
    console.log("edit Button",id);
    let self = this
    this.props.getProduct(id,(success, error)=>{
      if(success)
      {
        self.props.history.push({
          pathname: '/products/form',
          state: { mode }
        })
      }
    })
  }

  approveTableButton(){
    //console.log("data",this.state.selectedProduct)
    this.approveButton(this.state.selectedProduct)
  }

  cancelTableButton(){
    //console.log("data",this.state.selectedProduct)
    this.cancelButton(this.state.selectedProduct)
  }

  editTableButton(){
    //console.log("data",this.state.selectedProduct)
    this.editButton(this.state.selectedProduct._id)
  }

  deleteTableButton(){
    //console.log("data",this.state.selectedProduct)
    this.deleteButton(this.state.selectedProduct)
  }



  cancelButton(data){

    if(data.state === "sended")
    {
      return Swal.fire({
        icon: 'warning',
        title: 'Alto',
        text: "No se puede cancelar un producto que ya fue enviado a la tienda virtual",          
      })
    }

    const self = this

    Swal.fire({
      title: '¿Estas seguro de cancelar o rechazar este producto?',
      text: "Esta acción no podra deshacerse",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, adelante!',
      cancelButtonText: 'No'
    }).then( async (result) => {

      if (result.value) {
        const { value: text } = await Swal.fire({
          input: 'textarea',
          inputPlaceholder: 'Da una razón para cancelar o rechazar el producto..',
          inputAttributes: {
            'aria-label': 'Da una razón para cancelar o rechazar el producto'
          },
          showCancelButton: true,
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cancelar'
        })
        
        if (text) {

          console.log("product",data)

            if (text.length  < 10 )
            {
              return Swal.fire({
                icon: 'error',
                title: 'Ooops',
                text: "Necesita una descripción mas larga",          
              })
            }

            data.state = 'rejected'

            data.rejectJutification = text

            self.props.saveProduct(data,(res,err)=>{       
          
              if(res){
                
                self.initializeList()

                return Swal.fire({
                  icon: 'success',
                  title: 'Bien',
                  text: "Datos registrados",          
                })
              }           
              
            })

        }
      }
    })
  }

  resendAprov(data){

    const self = this

    Swal.fire({
      title: '¿Estas seguro de volver a enviar la aprobación del producto?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, adelante!',
      cancelButtonText: 'No'
    }).then( async (result) => {

      data.state = ''

      data.rejectJutification = ""

      self.props.saveProduct(data,(res,err)=>{       
    
        if(res){
          
          self.initializeList()

          return Swal.fire({
            icon: 'success',
            title: 'Bien',
            text: "Datos registrados",          
          })
        }           
        
      })       
      
    })
  }

  approveButton(data){
    console.log("approve Button",data);

    if(data.state === "sended")
    {
      return Swal.fire({
        icon: 'warning',
        title: 'Alto',
        text: "No se puede aprovar un producto que ya fue enviado a la tienda virtual",          
      })
    }

    const self = this

    Swal.fire({
      title: '¿Estas seguro de aprobar y enviar a prestashop la información?',
      text: "Esta acción no podra deshacerse",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000076',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, adelante!',
      cancelButtonText: 'No'
    }).then( async (result) => {
      if (result.value) {
        const { value: formValues } = await Swal.fire({
          confirmButtonColor: '#000076',
          title: 'Información adicional',
          html:
            '<input id="swal-input1" value="'+data.shopDefaultReference+'" placeholder="referencia" class="swal2-input">' +
            '<input id="swal-input2" value="'+data.recommendedPrice+'" placeholder="precio" class="swal2-input">',
          focusConfirm: false,
          preConfirm: () => {
            return [
              document.getElementById('swal-input1').value,
              document.getElementById('swal-input2').value         
            ]
          }
        })
        
        if (formValues) {

          console.log("formValues",formValues)

          if(formValues[0] == "" || formValues[1] == "")
          {
            return Swal.fire({
              icon: 'error',
              title: 'Espera',
              text: "Debes poner los datos de referencia y precio",          
            })
          }

          if(data.picture.length == 0)
          {
            return Swal.fire({
              icon: 'error',
              title: 'Espera',
              text: "Debes poner una imagen para este proceso",          
            })
          }          

          const dataToSend = { product:data._id, reference:formValues[0], price: formValues[1] }
          console.log("dataToSend",dataToSend) 
          
          this.props.createProductPrestashop(dataToSend,(success,error)=>{
            if(success)
            {
              self.initializeList()
              
              return Swal.fire({
                icon: 'success',
                title: 'Bien',
                text: "Producto creado en la tienda",          
              })
            }
            if(error)
            {
              return Swal.fire({
                icon: 'error',
                title: 'Sucedio error',
                text: "No esta la información completa para realizar este proceso",          
              })
            }
          })  

        }
      }
    })
  }

  deleteButton(data){
    console.log("delete Button",data);

    if(data.state === "sended")
    {
      return Swal.fire({
        icon: 'warning',
        title: 'Alto',
        text: "No se puede borrar un producto que ya fue enviado a la tienda virtual",          
      })
    }

    const self = this

    Swal.fire({
      title: '¿Estas seguro de eliminar este producto?',
      text: "Esta acción no podra deshacerse",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, adelante!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.props.deleteProduct(data,(success,error)=>{
          if(success)
          {
            self.initializeList()
            return Swal.fire({
              icon: 'success',
              title: 'Bueno',
              text: "El producto ha sido eliminado",          
            })
          }
          if(error)
          {
            return Swal.fire({
              icon: 'error',
              title: 'Ooops',
              text: "No se puede borrar el producto, comprueba la conexión con el servidor",          
            })
          }
        })
      }
    })
  }

  sendToApprove(){

    const self = this

    const { selectedProduct } = this.state

    console.log("selectedProduct",selectedProduct)

    if(selectedProduct)
    { 

      if(selectedProduct.state != "inShop" )
      {
        if(!selectedProduct.picture)
        {
          return Swal.fire('Espera','El producto debe tener una imagen de portada','warning')
        }
      }

      if(selectedProduct.state === "rejected")
      {
        Swal.fire('Este producto fue previamente rechazado',
        'Recuerde realizar los ajustes correspondientes para que sea aprobado',
        'warning').then( () => 
            Swal.fire({
              title: '¿Ya realizo los cambios?',
              text: "Razon de rechazo: "+selectedProduct.rejectJutification,
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, ¡adelante!'
            }).then((result) => {
              if (result.value) {
                  
                  let data = JSON.parse( JSON.stringify(selectedProduct) )

                  data.state = ''

                  data.rejectJutification = ""

                  self.props.saveProduct(data,(res,err)=>{       
                
                    if(res){
                      
                      self.initializeList()

                      return Swal.fire({
                        icon: 'success',
                        title: 'Bien',
                        text: "Datos registrados",          
                      })
                    }           
                    
                  })       
      
              }
        })
        )
      }else{
        if(selectedProduct.state === "sended" || selectedProduct.state === "inShop" || selectedProduct.state === "inShopRejected")
        {       
          Swal.fire({
              title: 'Espera',
              text: "Estos productos ya se encuentra en la tienda, desea enviar los datos para que se publiquen los cambios ",
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, ¡adelante!'
            }).then((result) => {
              console.log("result",result)
              if (result.value) {
                  
                  let data = JSON.parse( JSON.stringify(selectedProduct) )

                  data.state = 'inShopToApprove'

                  self.props.saveProduct(data,(res,err)=>{       
                
                    if(res){
                      
                      self.initializeList()

                      return Swal.fire({
                        icon: 'success',
                        title: 'Bien',
                        text: "Datos registrados",          
                      })
                    }           
                    
                  }) 
              }
           })
          
        }

        if(selectedProduct.state === "" || selectedProduct.state === "inShopToApprove"  )
        {
          return Swal.fire('Estos productos se encuentran pendientes de aprobación',
          'Espere  que el admin determine el resultado de estos productos',
          'warning')
        }

      }
    }
    
  }

  filteredProducts(data){
    //console.log("data",data)
    //return this.props.productsState.products
    
    if(data.length == 0)
    {
      this.setState({
        ...this.state,
        products:this.props.productsState.products
      })
    }else
    {
      data = data.toLowerCase()

      const filteredArray = this.props.productsState.products.filter( product => 
        product.name.toLowerCase().includes(data) ||
        product.description.toLowerCase().includes(data) 
      )

      this.setState({
          ...this.state,
          products:filteredArray
      })

    }

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

    const { page , rowsPerPage } = this.state;

    return (
      <div className={classes.root}>
        <p>Subir archivo</p>
        <input 
            required 
            type="file" 
            name="file" 
            id="file" 
            onChange={this.handleInputChange} 
        />
        

        <button onClick={ async ()=>{
          //alert("Formato adecuado para subir datos")
          Window.StopAutoFetching = true
          const file = await api.getData("/downloadFormat")
          //console.log("file",file)
          const blob = new Blob([file.data], { type: 'text/csv;charset=utf-8;' });
          const href = window.URL.createObjectURL(blob);
          const a = this.linkRef.current;
          a.download = 'format.csv';
          a.href = href;
          a.click();
          a.href = '';
          Window.StopAutoFetching = false
        }} >Descargar formato</button>

        <a ref={this.linkRef}/>

        <ProductsToolbar csvExport={this.csvExport}
          editButton={this.editTableButton}
          deleteButton={this.deleteTableButton}
          selectedProduct={this.state.selectedProduct}
          filteredProducts={this.filteredProducts}
          createButton={this.createButton}
          changeDetails={ this.changeDetails }
          viewMode={this.state.viewMode}
          approveButton={this.approveTableButton}
          cancelButton={this.cancelTableButton}
          sendToApprove={this.sendToApprove}
          user={this.props.authState.user}
          />

        {
          this.state.viewMode === "list" ? 
          <div className={classes.content}>
            <ProductsTable appState={this.props.appState}
              editButton={this.editButton}
              addSelectedProduct={this.addSelectedProduct}
              products={this.state.products} />
          </div>:null
        }
        
        {
          this.state.viewMode != "list" ?
          <div className={classes.content}>
            <Grid
              container
              spacing={3}
            >
              { this.state.products.length > 0 ? this.state.products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => (
                <Grid
                  item
                  key={product.id}
                  lg={4}
                  md={6}
                  xs={12}
                >
                  <ProductCard
                  editButton={this.editButton}
                  deleteButton={this.deleteButton}
                  cancelButton={this.cancelButton}
                  approveButton={this.approveButton}
                  resendAprov={this.resendAprov}
                  user={this.props.authState.user}
                  product={product} />
                </Grid>
              )) : false }
            </Grid>
          </div>:null
        }

        {
          this.state.viewMode != "list" ?
          <div className={classes.pagination}>
              <Typography variant="caption">{1  + (page * rowsPerPage) }-{ rowsPerPage * (page + 1) } of { this.state.products.length }</Typography>
            <IconButton>
              <ChevronLeftIcon onClick={this.leftPagination} />
            </IconButton>
            <IconButton>
              <ChevronRightIcon onClick={this.rightPagination} />
            </IconButton>
          </div>:null
        }

      </div>
    );
  }

}


const mapStateToProps = state => {
 
  return {
    productsState: state.products,
    authState: state.auth,
    appState: state.app    
  };
}

ProductList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const componentDefinition =  withStyles(useStyles)(ProductList);

export default  connect(mapStateToProps, { getProducts,
  getProduct,
  createProductPrestashop,
  deleteProduct,
  saveProduct } )(componentDefinition);



