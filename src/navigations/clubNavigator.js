import React, {useContext,useState} from 'react'
import { Text, View,Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EncryptedStorage from 'react-native-encrypted-storage';
import { globContext } from '../context/globContext';
import CallButton from '../components/callButton';
import { useNavigation,getFocusedRouteNameFromRoute } from '@react-navigation/native';
import VideoContainer from '../screens/video';
import { createStackNavigator } from '@react-navigation/stack';

import Clubs from '../screens/clubs';
import Club from '../screens/club';

const stack = createStackNavigator()
const ClubNavigator = () => {
    return(
        <stack.Navigator screenOptions={{headerShown:false}}>
            <stack.Screen name="Clubs" component={Clubs}/>
            <stack.Screen name="Club" component={Club}/>
        </stack.Navigator>
    )
}



export default ClubNavigator;