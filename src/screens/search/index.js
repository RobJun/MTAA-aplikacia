import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import Club from "../club";
import BookProfile from "../bookProfile";
import SearchScreen from "./Search";

const stack = createStackNavigator()

const SearchNavigator = ({navigation, route})=>{
    return (
            <stack.Navigator screenOptions={{headerShown:false}}>
                <stack.Screen name="Search" component={SearchScreen}/>
                <stack.Screen name="Book" component={BookProfile}/>
                <stack.Screen name="Club" component={Club}/>
            </stack.Navigator>
            )
}

export default SearchNavigator;