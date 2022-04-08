import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import Club from "../club";
import BookProfile from "../bookProfile";
import Profile from "./Profile";
import Settings from "./Settings";

const stack = createStackNavigator()
export const userContext = createContext({});

const initUserInfo = {
    groups : [],
    books : []
}

const UserContext = ({children}) =>{
    const [info,setInfo] = useState(initUserInfo)
    return <userContext.Provider value={{info,setInfo}}>{children}</userContext.Provider>
}

const ProfileNavigation = ({navigation, route})=>{
    return (
        <UserContext>
            <stack.Navigator screenOptions={{headerShown:false}}>
                <stack.Screen name= "Profile" component={Profile}/>
                <stack.Screen name= "Book" component={BookProfile}/>
                <stack.Screen name= "Club" component={Club}/>
                <stack.Screen name = "Settings" component={Settings}/>
            </stack.Navigator>
        </UserContext>)
}

export default ProfileNavigation;