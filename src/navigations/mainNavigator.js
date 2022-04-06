import React, {useContext,useState} from 'react'
import { Text, View,Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EncryptedStorage from 'react-native-encrypted-storage';
import { globContext } from '../context/globContext';
import CallButton from '../components/callButton';
import { useNavigation } from '@react-navigation/native';
import VideoContainer from '../screens/video';
import { createStackNavigator } from '@react-navigation/stack';

import Profile from '../screens/profile';
import Search from '../screens/search';
import HomeScreen from '../screens/home';
import Library from '../screens/library';
import Clubs from '../screens/clubs';

var token = ""

function SettingsScreen() {
    const {navigate} = useNavigation();
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Setting s!</Text>
        <CallButton icon={"video"} onPress={() =>{navigate('ClubsNav',{screen: 'Video'})}}></CallButton>
      </View>
    );
  }

const stack = createStackNavigator()

  const ScreenWithVideo = () => {
    return (
      <stack.Navigator>
        <stack.Screen name="Clubs" component={SettingsScreen} />
        <stack.Screen name="Video" component={VideoContainer} />
      </stack.Navigator>
    )
  }


  
  const Tab = createBottomTabNavigator();
  
  export default function MainNavigator() {
    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={{ showLabel: false }}>
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
          name="ClubsNav"
          component={Clubs}  
          options={{
            tabBarLabel: "Clubs",
            headerShown:false,
            tabBarIcon: ({color,size}) => (
                <MaterialCommunityIcons name="account-group" color={color} size={size} />
            )
          }}
          />
           <Tab.Screen 
          name="Search"
          component={Search} 
          options={{
            tabBarLabel: "Search",
            tabBarIcon: ({color,size}) => (
                <MaterialCommunityIcons name="magnify" color={color} size={size+20} />
            )
          }}
          />
           <Tab.Screen 
          name="My library"
          component={Library} 
          options={{
            tabBarLabel: "Library",
            tabBarIcon: ({color,size}) => (
                <MaterialCommunityIcons name="book" color={color} size={size} />
            )
          }}
          />
           <Tab.Screen 
          name="Profile"
          component={Profile} 
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