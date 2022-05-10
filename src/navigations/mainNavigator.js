import React, {useContext, useEffect} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { globContext } from '../context/globContext';
import HomeScreen from '../screens/home';
import ClubNavigator from './clubNavigator';
import LibraryNavigation from '../screens/library';
import SearchNavigator from '../screens/search';
import ProfileNavigation from '../screens/profile';
import {fetchBooks, fetchInfo } from '../api_calls/user_calls';
import {  userData } from '../context/reducers/storageReducer';
import { useIsConnected } from 'react-native-offline';
import EncryptedStorage from 'react-native-encrypted-storage';
import { getClubInfo } from '../api_calls/club_calls';
import { API_SERVER } from '../api_calls/constants';
import { LOAD_FROM_MEMORY, LOAD_INITIAL } from '../context/constants/offline';
import OfflineScreen from '../screens/offlineScreen';

  const Tab = createBottomTabNavigator();
  
  export default function MainNavigator() { 
    const isConnected = useIsConnected()
    const {auth:{user:{token,user_id},isLogged},setAuth,visible,setLoading,setOffline,offline,setInitLoading} = useContext(globContext)

    useEffect(() => {
      const loadFromMemory =  async() =>{
        const val = JSON.parse(await EncryptedStorage.getItem('user_data'))
       
        setOffline({type:LOAD_FROM_MEMORY, payload: val})
        setLoading(false)
        setInitLoading(true)
      }
      const fetchData = async() => { //prerobenie na to abz sa ukkladalo do pamati
        try{

        var state = {...userData}
        const val = JSON.parse(await EncryptedStorage.getItem('user_data'))
      

        if(val !== null)
          state = {
            ...state,
            callQueue : val.callQueue,
            isSynced : val.isSynced,
          }

        await fetchInfo(user_id,(user)=>{state.userData = user})
        await fetchBooks(user_id,(books)=>{state.wishlist = books},"wishlist")
        await fetchBooks(user_id,(books)=>{state.reading = books},"reading")
        await fetchBooks(user_id,(books)=>{state.completed = books},"completed")
       
        //fetch user books info
        s = ['wishlist','reading','completed']
        for(var i = 0; i <3;i++){
          for(var j = 0;j < state[s[i]].length;j++){
            const res = await fetch(`http://${API_SERVER}/find/info/${state[s[i]][j].id}/`)
            const data = await res.json()
            state.user_book_profiles = {
              ...state.user_book_profiles,
              [data.id] : data
            }
          }
        }
        for(var j = 0;j < state.userData.recommended_books.length;j++){
          const res = await fetch(`http://${API_SERVER}/find/info/${state.userData.recommended_books[j].id}/`)
          const data = await res.json()
          state.user_book_profiles = {
            ...state.user_book_profiles,
            [data.id] : data
          }
        }
        //fetch groups info
        for(var i = 0; i < state.userData.clubs.length;i++){
           await getClubInfo(state.userData.clubs[i].id,(group)=>{state.user_club_profiles = {
            ...state.user_club_profiles,
            [group.id] : group
          }
        })
        }
          
       
        setOffline({type:LOAD_INITIAL,payload :state})
       
        setLoading(false)
       
        setInitLoading(true)
        } catch(err) {
         
          alert('Network connection error')
          setAuth({type:"LOGOUT"})
        }
      }
      if(isConnected === null || offline.loaded == true) return;
      if(isLogged){
       
        if(isConnected){
          fetchData().catch(console.error)
         
        }else{
          loadFromMemory()
        }
      }
    }, [isConnected])


    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={{headerShown:false, tabBarStyle : {display: (visible ? 'flex' : 'none')},tabBarActiveTintColor: "#5e8d5a",
        tabBarShowLabel: false,}}>
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