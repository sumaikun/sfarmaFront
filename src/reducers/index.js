import { combineReducers } from "redux";
import { auth } from "./auth";
import { app } from "./app";
import { users } from "./users";
import { products } from "./products";



const reducers = combineReducers({
  
  auth,
  app,
  users,
  products
  
});

export default reducers;