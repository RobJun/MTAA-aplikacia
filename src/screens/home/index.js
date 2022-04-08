import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import HomeScreen from "./Home";
import Club from "../club";
import BookProfile from "../bookProfile";

const stack = createStackNavigator()

const Home = ({navigation, route})=>{
    return (
            <stack.Navigator screenOptions={{headerShown:false}}>
                <stack.Screen name="Home" component={HomeScreen}/>
                <stack.Screen name="Book" component={BookProfile}/>
                <stack.Screen name="Club" component={Club}/>
            </stack.Navigator>
            )
}

export default Home;