import React, {useContext,useState} from 'react'
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