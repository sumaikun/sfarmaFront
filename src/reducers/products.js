import {
    SET_PRODUCTS,
    ADD_PRODUCT,
    REMOVE_PRODUCT,
    SELECT_PRODUCT
  } from "../constants";
  
  let index

  export function products(
    state = {
      products:[],     
      selectedProduct:{} 
    },
    action
  ) {
    switch (action.type) {

      case SET_PRODUCTS:
        
        return Object.assign({}, state, {
          products:action.products,         
        });

      case SELECT_PRODUCT:

        return Object.assign({}, state, {
          selectedProduct:action.product,         
        });

      case ADD_PRODUCT:
        
        index = state.products.findIndex(  data => data.id === action.product.id  );

        index ? state.products[index] = action.product : state.products.push(action.product);
        
        return state;

      case REMOVE_PRODUCT:

        index = state.products.findIndex(  data => data.id === action.product.id  );

        state.products.splice(index,1);

        return state;

      default:
        return state;


    }
  }