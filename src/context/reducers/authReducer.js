//pociatocny stav authObjektu
import React from 'react'


export const initAuthState = {
    isLogged: false,
    user : { },
    error : null,
    loading : false
}

export const authReducer = (state,{type,payload}) => {
    console.log(payload)
    switch (type) {
        case "LOGIN":
            console.log("auth -- login success")
            return {
                ...state,
                isLogged: true,
                loading : false,
                user: payload
            }
        case "LOADING": 
            console.log("auth -- loading")
            return {
                ...state,
                loading: true
            }

        case "ERROR": 
            console.log("auth -- error")
            return {
                ...state,
                loading: false,
                error: payload
            }
        case "CLEAR": 
        console.log("auth -- clear error")
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

