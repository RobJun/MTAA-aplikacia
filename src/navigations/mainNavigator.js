import React, {useContext,useState} from 'react'
import { Text, View, } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EncryptedStorage from 'react-native-encrypted-storage';
import { globContext } from '../context/globContext';

var token = ""

async function retrieveUserSession(dispatchToken,dispatch) {
  try {   
      const session = await EncryptedStorage.getItem("user_token");
      if (session !== undefined) {
          // Congrats! You've just retrieved your first value! 
          console.log(session)
          dispatch(JSON.parse(session).token)

      }
  } catch (error) {
      // There was an error on the native side
  }
}

function HomeScreen() {
    console.log("erer")
    const {auth:{user:{user_id,token}}} = useContext(globContext)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{user_id}</Text>
        <Text>{token}</Text>
      </View>
    );
  }
  
  function SettingsScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }
  
  const Tab = createBottomTabNavigator();
  
  export default function MainNavigator() {
    return (
        <Tab.Navigator initialRouteName="Home" tabBarOptions={{ showLabel: false }}>
          <Tab.Screen 
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel:"Home",
                    tabBarIcon: ({color,size}) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    )
                }} />
          <Tab.Screen 
          name="Clubs"
          component={SettingsScreen} 
          options={{
            tabBarLabel: "Clubs",
            tabBarIcon: ({color,size}) => (
                <MaterialCommunityIcons name="account-group" color={color} size={size} />
            )
          }}
          />
           <Tab.Screen 
          name="Search"
          component={SettingsScreen} 
          options={{
            tabBarLabel: "Search",
            tabBarIcon: ({color,size}) => (
                <MaterialCommunityIcons name="magnify" color={color} size={size+20} />
            )
          }}
          />
           <Tab.Screen 
          name="My library"
          component={SettingsScreen} 
          options={{
            tabBarLabel: "Library",
            tabBarIcon: ({color,size}) => (
                <MaterialCommunityIcons name="book" color={color} size={size} />
            )
          }}
          />
           <Tab.Screen 
          name="Profile"
          component={SettingsScreen} 
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({color,size}) => (
                <MaterialCommunityIcons name="account" color={color} size={size} />
            )
          }}
          />
        </Tab.Navigator>
    );
  }