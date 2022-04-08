import { createStackNavigator } from "@react-navigation/stack";
import React,{useContext,useState,useEffect,createContext,useReducer} from "react";
import VideoContainer from "../video";
import ClubScreen from "./Club";
import ClubSettingScreen from "./clubSettings";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";


export const clubContext = createContext({});
const stack = createStackNavigator()

const initClubInfo = {
        users : [],
        book_of_the_week : {}
}

const ClubContext = ({children}) =>{

    const [info,setInfo] = useState(initClubInfo)

    return <clubContext.Provider value={{info,setInfo}}>{children}</clubContext.Provider>
}


const Club = ({navigation,route})=>{
    React.useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        console.log(routeName)
        if (routeName === "Club_video"){
          console.log("should be invisible")
            navigation.setOptions({tabBarStyle: {display: 'none'}});
        }else {
            navigation.setOptions({tabBarStyle: {display: 'flex'}});
        }
    }, [navigation, route]);
    return (<ClubContext>
                <stack.Navigator screenOptions={{headerShown:false}}>
                    <stack.Screen
                        name="Club_screen"
                        component={ClubScreen}/>
                    <stack.Screen
                        name="Club_settings"
                        component={ClubSettingScreen}/>
                    <stack.Screen
                        name="Club_video"
                        component={VideoContainer}
                        options={{ unmountOnBlur: true}}
                    />
                </stack.Navigator>
            </ClubContext>)
}

export default Club;