import React, {createContext, useReducer,useState} from 'react'
import {authReducer,initAuthState} from './reducers/authReducer'

export const globContext = createContext({});

const GlobProvider = ({children}) => {
    //pridavat globalne stavy
    const [auth, setAuth] = useReducer(authReducer,initAuthState)
    const [stun,setStun] = useState(true)
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

    const [visible,setVisible] = useState(true)


    const [loading,setLoading] = useState(true)

    return <globContext.Provider value={{auth,setAuth,
                                        user,setUser,
                                        groups,setGroups,
                                        library,setLibrary,
                                        stun,setStun,
                                        visible,setVisible,
                                        loading,setLoading}}>{children}</globContext.Provider>
}

export default GlobProvider;