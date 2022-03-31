import React, {createContext, useReducer} from 'react'


export const globContext = createContext({});


//pociatocny stav authObjektu
const initAuthState = {
    isLogged: false,
    user : { },
    error : null,
    loading : false
}

const authReducer = (state,{type,payload}) => {
    console.log("->>>>>>>>")
    console.log(payload)
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
            console.log("serer")
            return {
                ...state,
                loading: false,
                error: payload
            }
        case "CLEAR": 
            console.log("clearing")
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
};


const GlobProvider = ({children}) => {
    //pridavat globalne stavy
    const [auth, setAuth] = useReducer(authReducer,initAuthState)

    return <globContext.Provider value={{auth,setAuth}}>{children}</globContext.Provider>
}

export default GlobProvider;