import React, {useContext,useState,useEffect} from 'react';
import {View,Text} from 'react-native'
import { NavigationContainer} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import MainNavigator from './mainNavigator';
import AuthNavigator from './authNavigator';
import { globContext } from '../context/globContext';
import SplashScreen from '../screens/splashscreen';
import {login_call} from '../api_calls/auth_calls';
import { useNetInfo } from '@react-native-community/netinfo';
import { LOAD_FROM_MEMORY, LOAD_INITIAL } from '../context/constants/offline';



const AppContainer = () =>{
    const {auth, setAuth,offline,setOffline,setInitLoading} = useContext(globContext)
    const [loading, setLoading] = useState(false)
    const [loadedNetInfo, setLoadedNetInfo] = useState(false)
    const [body, setBody] = useState(undefined)
    const {isConnected} =useNetInfo()


    const loader = async () => {
        try {   
            const session = await EncryptedStorage.getItem("user_info");
            if(!isConnected) {
               
                const m = await EncryptedStorage.getItem("user_offline");
                if(m === null) return;
                const s = JSON.parse(m)
                //setAuth({type:"LOGIN",payload: s})
                const data = await EncryptedStorage.getItem("user_data")
                setBody(s)
                setOffline({type: LOAD_FROM_MEMORY, payload : JSON.parse(data)})
                return true;
            }
            if (session !== undefined && session !== null) {
                console.log('here')
                const s = JSON.parse(session)
               
                let log = await login_call(s)
               
                if(log.code !== 200) {
                    throw "didn't loggin"
                }

                const data = await EncryptedStorage.getItem("user_data")
                setBody(log.body)
                if(data == null) return true;
                setOffline({type: LOAD_FROM_MEMORY, payload : JSON.parse(data)})
                return false;
            }
        } catch (error) {
            throw error;
            
        }
        return -1;
    }

    useEffect(()=>{
        console.log('splash_screen_status:',offline.loaded, offline.syncing, offline.isSynced,auth.isLogged)
        console.log('splash_screen_status:',offline.callQueue)
        if(!offline.loaded) {
            console.log('offline not loaded yet')
            return;
        }else{
            setInitLoading(true)
        }
        if(offline.isSynced && !auth.isLogged && body){
            setAuth({type: "LOGIN", payload : body})
            return;
        }
    },[offline])

    useEffect(()=>{
        if(auth.isLogged){
        setLoading(true)
        }
    },[auth])

    useEffect(()=>{
        console.log('splash_screen_loading_connection')
        if(isConnected === true || isConnected === false){ 
            setLoadedNetInfo(true)
            console.log('->splash_screen_loading_connection_success')
        }
        return ()=>{setLoadedNetInfo(false)}
    },[isConnected])

    useEffect(() => {
        if(loadedNetInfo === false) return;
        console.log('splash_screen_before_login: ', auth.isLogged)
        if(!auth.isLogged){
        loader().then((online) => { 
            console.log('logging phase: ',online)
            setLoading(online)
        }).catch(err=> {  
            setLoading(true)
        })
        }
    },[loadedNetInfo])



   
    if(!loading) {
        console.log('I AM HERE LOGGING')
        return <SplashScreen/>
    }

    return(
        <NavigationContainer>
                {auth.isLogged? <MainNavigator/>:<AuthNavigator/>}
        </NavigationContainer>
    );
};


export default AppContainer;
