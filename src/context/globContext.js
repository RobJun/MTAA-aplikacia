import React, {createContext, useEffect, useReducer,useState} from 'react'
import { NetworkProvider } from 'react-native-offline';
import {authReducer,initAuthState} from './reducers/authReducer'
import { userData,syncReducer, data} from './reducers/storageReducer';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { deleteGroup, joinClub, leaveClub, removeMember, saveChanges, setBook } from '../api_calls/club_calls';
import { fetchInfo, saveUserChanges } from '../api_calls/user_calls';
import { CHANGE_VALUE, DELETE_CLUB, JOIN_CLUB, LEAVE_CLUB, REMOVE_MEMBER, SAVE_CLUB, SAVE_USER, SET_BOOK_WEEK, SYNC_FAILED, SYNC_SUCCESS } from './constants/offline';
export const globContext = createContext({});

const GlobProvider = ({children}) => {

    const {isConnected} = useNetInfo()
    //pridavat globalne stavy
    const [offline,setOffline] = useReducer(syncReducer,userData)
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
    const [initLoading,setInitLoading] = useState(false)

    useEffect(()=>{
        if(offline.loaded)
        EncryptedStorage.setItem('user_data',JSON.stringify(offline, function replacer(key, value) { return value}))
    },[offline])

    useEffect(()=>{
        const f = async()=>{
            callQ = [...offline.callQueue]
            var clubdata =  undefined
            var userData = {...offline.userData}
            console.log('syncing : ', callQ, callQ.length)
            while(callQ.length !== 0){
                if(isConnected === false){
                    setOffline({type : SYNC_FAILED, payload : {callQueue : callQ}})
                    return;
                }
                switch(callQ[0].type){
                    case LEAVE_CLUB:
                        clubdata = await leaveClub(callQ[0].club_id,(data)=>{},callQ[0].token)
                        break;
                    case JOIN_CLUB:
                        clubdata = await joinClub(callQ[0].club_id,(data)=>{},callQ[0].token)
                        break;
                    case DELETE_CLUB: 
                        await deleteGroup(callQ[0].club_id,callQ[0].token)
                        break;
                    case SAVE_CLUB:
                        clubdata = await saveChanges(callQ[0].club_id,callQ[0].form,callQ[0].token,(data)=>{},(bool)=>{},false)
                        break;
                    case SET_BOOK_WEEK: 
                        clubdata = await setBook(callQ[0].club_id,callQ[0].book_id,callQ[0].token)
                        break;
                    case REMOVE_MEMBER:
                        clubdata = await removeMember(callQ[0].token,callQ[0].club_id,callQ[0].member_id)
                    case SAVE_USER:
                        userData = await saveUserChanges(callQ[0].token,callQ[0].form)
                    
                }
                if(callQ[0].user_id !== undefined){
                    userData = await fetchInfo(callQ[0].user_id,(data)=>{})
                }


                setOffline({type:CHANGE_VALUE,offline: false, payload : {type : callQ[0].type,data : {userData : userData,clubInfo: clubdata}}})


                callQ.splice(0,1)
            }

            setOffline({type : SYNC_SUCCESS, payload : {}})
        }
       
        if(initLoading !== true) return;
        if(isConnected === true && offline.isSynced === false){   
           f()
        }
    },[isConnected,initLoading])

    return(<globContext.Provider value={{auth,setAuth,
                                        user,setUser,
                                        groups,setGroups,
                                        library,setLibrary,
                                        stun,setStun,
                                        visible,setVisible,
                                        loading,setLoading,
                                        offline,setOffline,setInitLoading}}>{children}</globContext.Provider>
            )
}

export default GlobProvider;