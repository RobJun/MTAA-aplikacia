//pociatocny stav authObjektu
import React from 'react'


export const initAuthState = {
    isLogged: false,
    user : { },
    error : null,
    loading : false
}

export const authReducer = (state,{type,payload}) => {
   
    switch (type) {
        case "LOGIN":
           
            return {
                ...state,
                isLogged: true,
                loading : false,
                user: payload
            }
        case "LOADING": 
           
            return {
                ...state,
                loading: true
            }

        case "ERROR": 
           
            return {
                ...state,
                loading: false,
                error: payload
            }
        case "CLEAR": 
       
            return {
                ...state,
                error: null
            }
        case "LOGOUT": 
            return {
                ...state,
                isLogged: false,
                user : {}
            }
        default:
            return state;
    }
};

