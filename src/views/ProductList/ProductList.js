import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { IconButton, Grid, Typography } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { ProductsToolbar, ProductCard } from './components';
import { connect } from 'react-redux';

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
    
    this.props.getProducts((success,error)=>{
      this.setState({
        ...this.state,
        products:this.props.productsState.products,
        selectedProduct:null,
        page:0,
        rowsPerPage:6
      })
    })


    
    this.createButton = this.createButton.bind(this)
    this.editButton = this.editButton.bind(this)
    this.deleteButton = this.deleteButton.bind(this)
    this.filteredProducts = this.filteredProducts.bind(this)
    this.addSelectedProduct = this.addSelectedProduct.bind(this)


    this.leftPagination = this.leftPagination.bind(this)
    this.rightPagination = this.rightPagination.bind(this)

    this.csvExport = this.csvExport.bind(this)
  
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
    this.props.history.push('/products/form')
  }

  editButton(id){
    console.log("edit Button",id);
    let self = this
    this.props.getProduct(id,(success, error)=>{
      if(success)
      {
        self.props.history.push('/products/form')
      }
    })
  }

  deleteButton(id){
    console.log("delete Button");
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
            {this.state.products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => (
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
                product={product} />
              </Grid>
            ))}
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
  };
}

ProductList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const componentDefinition =  withStyles(useStyles)(ProductList);

export default  connect(mapStateToProps, { getProducts , getProduct } )(componentDefinition);



