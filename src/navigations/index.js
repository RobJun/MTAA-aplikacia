import React, {useContext} from 'react';
import {View,ActivityIndicator} from 'react-native'
import { NavigationContainer} from '@react-navigation/native';
import MainNavigator from './mainNavigator';
import AuthNavigator from './authNavigator';
import { globContext } from '../context/globContext';

const AppContainer = () =>{
    const {auth, setAuth} = useContext(globContext)
    return(
        <NavigationContainer>
            {auth.isLogged? <MainNavigator/>:<AuthNavigator/>}
        </NavigationContainer>
    );
};


export default AppContainer;
