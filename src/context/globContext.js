import React, {createContext, useReducer,useState} from 'react'
import {authReducer,initAuthState} from './reducers/authReducer'

export const globContext = createContext({});

const GlobProvider = ({children}) => {
    //pridavat globalne stavy
    const [auth, setAuth] = useReducer(authReducer,initAuthState)
    const [user,setUser] = useState({
        id: "string",
        displayName: "string",
        photoPath: "string",
        wishlist: 0,
        currently_reading: 0,
        completed: 0,
        recommended_books: [],
        clubs: []
    })
    const [library,setLibrary] = useState({
        wishlist : [],
        reading : [],
        completed : []
    })

    const [groups,setGroups] = useState([])

    return <globContext.Provider value={{auth,setAuth,user,setUser,groups,setGroups,library,setLibrary}}>{children}</globContext.Provider>
}

export default GlobProvider;