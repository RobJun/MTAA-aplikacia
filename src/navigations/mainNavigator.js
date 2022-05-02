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
import { LOAD_FROM_MEMORY, LOAD_INITIAL, userData } from '../context/reducers/storageReducer';
import { useIsConnected } from 'react-native-offline';
import EncryptedStorage from 'react-native-encrypted-storage';

  const Tab = createBottomTabNavigator();
  
  export default function MainNavigator() { 
    const isConnected = useIsConnected()
    const {auth:{user:{token,user_id},isLogged},setAuth,setUser,setLibrary,setGroups,visible,setLoading,setOffline,offline} = useContext(globContext)

    useEffect(() => {
      const loadFromMemory =  async() =>{
        const val = JSON.parse(await EncryptedStorage.getItem('user_data'))
        console.log(val)
        setOffline({type:LOAD_FROM_MEMORY, payload: val})
        setLoading(false)
      }
      const fetchData = async() => { //prerobenie na to abz sa ukkladalo do pamati
        try{
        var state = {...userData}
        await fetchInfo(user_id,(user)=>{state.userData = user})
        await fetchBooks(user_id,(books)=>{state.wishlist = books},"wishlist")
        await fetchBooks(user_id,(books)=>{state.reading = books},"reading")
        await fetchBooks(user_id,(books)=>{state.completed = books},"completed")
        await fetchGroups(user_id,(groups)=>{state.clubs = groups})
        console.log('this state -',state)
        setOffline({type:LOAD_INITIAL,payload :state})
        console.log('online --', offline)
        setLoading(false)
        console.log('here')
        } catch(err) {
          console.log(err)
          alert('Network connection error')
          setAuth({type:"LOGOUT"})
        }
      }
      if(isConnected === null) return;
      if(isLogged){
        console.log('connection',isConnected)
        if(isConnected){
          fetchData().catch(console.error)
          console.log('online --', offline)
        }else{
          loadFromMemory()
        }
      }
    }, [isConnected])


    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={{headerShown:false, tabBarStyle : {display: (visible ? 'flex' : 'none')}}} tabBarOptions={{showLabel: false, activeTintColor: '#5e8d5a'}}>
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