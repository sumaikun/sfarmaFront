import {
    SET_FETCHING,
    SET_LABORATORIES
  } from "../constants";

  export function app(
    state = {
      loading:false,
      laboratories:[]
    },
    action
  ) {
    switch (action.type) {

      case SET_FETCHING:
        console.log("setting is fetching",action)
        return Object.assign({}, state, {
          loading:action.payload
        });

      case SET_LABORATORIES:
        console.log("setting laboratories",action)
        return Object.assign({}, state, {
          laboratories:action.payload
        });
              
      default:
        return state;


    }
  }