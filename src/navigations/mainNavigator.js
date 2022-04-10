import React, {useContext, useEffect} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { globContext } from '../context/globContext';

import HomeScreen from '../screens/home';
import ClubNavigator from './clubNavigator';
import LibraryNavigation from '../screens/library';
import SearchNavigator from '../screens/search';
import ProfileNavigation from '../screens/profile';
import {fetchBooks, fetchGroups, fetchInfo } from '../api_calls/user_calls';


  const Tab = createBottomTabNavigator();
  
  export default function MainNavigator() {
    
    const {auth:{user:{token,user_id}},setUser,setLibrary,setGroups} = useContext(globContext)

    
    useEffect(() => {
        fetchInfo(user_id,setUser)
        fetchBooks(user_id,(books)=>{setLibrary((prev)=>{return {...prev , wishlist : books}})},"wishlist")
        fetchBooks(user_id,(books)=>{setLibrary((prev)=>{return {...prev , reading : books}})},"reading")
        fetchBooks(user_id,(books)=>{setLibrary((prev)=>{return {...prev , completed : books}})},"completed")
        fetchGroups(user_id,setGroups)
    }, [])


    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={{headerShown:false}} tabBarOptions={{showLabel: false, activeTintColor: '#5e8d5a'}}>
          <Tab.Screen 
                name="HomeNav"
                component={HomeScreen}
                options={{
                    tabBarLabel:"Home",
                    tabBarIcon: ({color,size}) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    )
                }} />
          <Tab.Screen 
          name="ClubsNav"
          component={ClubNavigator}  
          options={{
            tabBarLabel: "Clubs",
            headerShown:false,
            tabBarIcon: ({color,size}) => (
                <MaterialCommunityIcons name="account-group" color={color} size={size} />
            )
          }}
          />
           <Tab.Screen 
          name="SearchNav"
          component={SearchNavigator} 
          options={{
            tabBarLabel: "Search",
            tabBarIcon: ({color,size}) => (
                <MaterialCommunityIcons name="magnify" color={color} size={size+20} />
            )
          }}
          />
           <Tab.Screen 
          name="LibraryNav"
          component={LibraryNavigation} 
          options={{
            tabBarLabel: "Library",
            tabBarIcon: ({color,size}) => (
                <MaterialCommunityIcons name="book" color={color} size={size} />
            )
          }}
          />
           <Tab.Screen 
          name="ProfileNav"
          component={ProfileNavigation} 
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