import React, {useContext,useState,useEffect} from 'react';
import {View,Text} from 'react-native'
import { NavigationContainer} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import MainNavigator from './mainNavigator';
import AuthNavigator from './authNavigator';
import { globContext } from '../context/globContext';
import SplashScreen from '../screens/splashscreen';
import {login_call} from '../api_calls/auth_calls';



const AppContainer = () =>{
    const {auth, setAuth} = useContext(globContext)
    const [loading, setLoading] = useState(false)


    const loader = async () => {
        try {   
            const session = await EncryptedStorage.getItem("user_info");
            if (session !== undefined && session !== null) {
                const s = JSON.parse(session)
                console.log("splash_screen_loader -- ",s)
                let log = await login_call(s)
                if(log.code !== 200) {
                    throw "didn't loggin"
                }
                console.log("splash_screen_loader_success" - log)
                await setAuth({type: "LOGIN", payload : log.body})
                return ;
            }
        } catch (error) {
            throw error;
            
        }
        return;
    }

    useEffect(() => {
        loader().then(() => { 
            setLoading(true)
        }).catch(err=> {
            console.log(err)
            setLoading(true)
        })
    },[])
    console.log(loading)
    if(!loading) {
        console.log(loading)
        return <SplashScreen/>
    }

    return(
        <NavigationContainer>
            {auth.isLogged? <MainNavigator/>:<AuthNavigator/>}
        </NavigationContainer>
    );
};


export default AppContainer;
