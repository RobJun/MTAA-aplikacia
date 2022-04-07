import React, {createContext, useReducer} from 'react'
import {authReducer,initAuthState} from './reducers/authReducer'

export const globContext = createContext({});

const GlobProvider = ({children}) => {
    //pridavat globalne stavy
    const [auth, setAuth] = useReducer(authReducer,initAuthState)

    return <globContext.Provider value={{auth,setAuth}}>{children}</globContext.Provider>
}

export default GlobProvider;