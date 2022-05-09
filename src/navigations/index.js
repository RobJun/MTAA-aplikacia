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



const AppContainer = () =>{
    const {auth, setAuth} = useContext(globContext)
    const [loading, setLoading] = useState(false)
    const [loadedNetInfo, setLoadedNetInfo] = useState(false)
    const {isConnected} =useNetInfo()


    const loader = async () => {
        try {   
            const session = await EncryptedStorage.getItem("user_info");

           
            if(!isConnected) {
               
                const offline = await EncryptedStorage.getItem("user_offline");
                if(offline === null) return;
                const s = JSON.parse(offline)
                await setAuth({type:"LOGIN",payload: s})
               
                return;
            }
            if (session !== undefined && session !== null) {
                const s = JSON.parse(session)
               
                let log = await login_call(s)
               
                if(log.code !== 200) {
                    throw "didn't loggin"
                }
               
                await setAuth({type: "LOGIN", payload : log.body})
                return ;
            }
        } catch (error) {
            throw error;
            
        }
        return;
    }

    useEffect(()=>{
        if(isConnected === true || isConnected === false) setLoadedNetInfo(true)
    },[isConnected])

    useEffect(() => {
        if(loadedNetInfo === false) return;
        if(!auth.isLogged){
        loader().then(() => { 
            setLoading(true)
        }).catch(err=> {
           
            setLoading(true)
        })
        }
    },[loadedNetInfo])



   
    if(!loading) {
       
        return <SplashScreen/>
    }

    return(
        <NavigationContainer>
                {auth.isLogged? <MainNavigator/>:<AuthNavigator/>}
        </NavigationContainer>
    );
};


export default AppContainer;
