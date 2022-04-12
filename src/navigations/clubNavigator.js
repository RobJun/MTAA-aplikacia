import React, {useContext,useState} from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import Clubs from '../screens/clubs';
import Club from '../screens/club';
import NewClubForm from '../screens/newClub';
import BookProfile from '../screens/bookProfile';

const stack = createStackNavigator()
const ClubNavigator = () => {
    return(
        <stack.Navigator screenOptions={{headerShown:false}}>
            <stack.Screen name="Clubs" component={Clubs}/>
            <stack.Screen name="Club" component={Club}/>
            <stack.Screen name="Create_Club" component={NewClubForm}/>
        </stack.Navigator>
    )
}



export default ClubNavigator;