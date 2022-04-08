import React from "react"
import { createStackNavigator } from "@react-navigation/stack";

import BookProfile from "../bookProfile";
import Library from "./Library"

const stack = createStackNavigator()

const LibraryNavigation = () => {
    return (
        <stack.Navigator screenOptions={{headerShown:false}}>
            <stack.Screen
                name="Library"
                component={Library}/>
            <stack.Screen
                name="Book"
                component={BookProfile}/>
        </stack.Navigator>
    )
}

export default LibraryNavigation