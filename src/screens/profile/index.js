import { createStackNavigator, createContext } from "@react-navigation/stack";
import React from "react";

import Club from "../club";
import BookProfile from "../bookProfile";
import Profile from "./Profile";
import Settings from "./Settings";

const stack = createStackNavigator()

const ProfileNavigation = ({navigation, route})=>{
    return (
            <stack.Navigator screenOptions={{headerShown:false}}>
                <stack.Screen name= "Profile" component={Profile}/>
                <stack.Screen name= "Book" component={BookProfile}/>
                <stack.Screen name= "Club" component={Club}/>
                <stack.Screen name = "Settings" component={Settings}/>
            </stack.Navigator>
    )
}

export default ProfileNavigation;