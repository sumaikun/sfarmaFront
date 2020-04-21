import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { IconButton, Grid, Typography } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { ProductsToolbar, ProductCard } from './components';
import { connect } from 'react-redux';
import { useLocation } from "react-router-dom";
import Swal from 'sweetalert2'
import { getProducts , getProduct } from 'actions/products';

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
      products:[]
    }   
  }

  componentDidMount(){

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
              products:this.props.productsState.products.filter( data => data.laboratory === this.props.history.location.state.data && data.state != "sended"   ),
              selectedProduct:null,
              page:0,
              rowsPerPage:6
            })
          }
        })  

        
      }
    }  


    
    this.createButton = this.createButton.bind(this)
    this.editButton = this.editButton.bind(this)
    this.deleteButton = this.deleteButton.bind(this)
    this.filteredProducts = this.filteredProducts.bind(this)
    this.addSelectedProduct = this.addSelectedProduct.bind(this)


    this.leftPagination = this.leftPagination.bind(this)
    this.rightPagination = this.rightPagination.bind(this)

    this.csvExport = this.csvExport.bind(this)


    this.cancelButton = this.cancelButton.bind(this)
    this.approveButton = this.approveButton.bind(this)
  
  }

  addSelectedProduct(id){

    let product = this.state.products.filter( product =>  product._id === id )[0]
    
    this.setState({
      ...this.state,
      selectedProduct:product,
    })

  }

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

  cancelButton(data){
    Swal.fire({
      title: '¿Estas seguro de cancelar este producto?',
      text: "Esta acción no podra deshacerse",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, adelante!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        
      }
    })
  }

  approveButton(data){
    console.log("create Button");
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
            '<input id="swal-input1" placeholder="referencia" class="swal2-input">' +
            '<input id="swal-input2" placeholder="precio sin iva" class="swal2-input">'+
            '<input id="swal-input3" placeholder="precio con iva" class="swal2-input">'+
            '<input id="swal-input4" placeholder="cantidad" class="swal2-input">',
          focusConfirm: false,
          preConfirm: () => {
            return [
              document.getElementById('swal-input1').value,
              document.getElementById('swal-input2').value,
              document.getElementById('swal-input3').value,
              document.getElementById('swal-input4').value
            ]
          }
        })
        
        if (formValues) {
          Swal.fire(JSON.stringify(formValues))
        }
      }
    })
  }

  deleteButton(data){
    console.log("delete Button");

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
        
      }
    })
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
        <ProductsToolbar csvExport={this.csvExport} filteredProducts={this.filteredProducts} createButton={this.createButton}  />
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
                user={this.props.authState.user}
                product={product} />
              </Grid>
            )) : false }
          </Grid>
        </div>
        <div className={classes.pagination}>
            <Typography variant="caption">{1  + (page * rowsPerPage) }-{ rowsPerPage * (page + 1) } of { this.state.products.length }</Typography>
          <IconButton>
            <ChevronLeftIcon onClick={this.leftPagination} />
          </IconButton>
          <IconButton>
            <ChevronRightIcon onClick={this.rightPagination} />
          </IconButton>
        </div>
      </div>
    );
  }

}


const mapStateToProps = state => {
 
  return {
    productsState: state.products,
    authState: state.auth  
  };
}

ProductList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const componentDefinition =  withStyles(useStyles)(ProductList);

export default  connect(mapStateToProps, { getProducts , getProduct } )(componentDefinition);



