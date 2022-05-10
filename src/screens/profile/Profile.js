import React, {useContext,useState,useEffect, useCallback} from "react"
import {View, Text,StyleSheet, ScrollView, FlatList, TouchableOpacity, RefreshControl,Animated, Image} from 'react-native'
import ButtonSettings from "./button"
import ProfileImage from "../../components/profileImage"
import { useNavigation } from '@react-navigation/native';
import { globContext } from "../../context/globContext";
import { fetchInfo } from "../../api_calls/user_calls"
import { HorizontalBookList, LoadingList, LoadingProfilePhoto, LoadingText } from "../../components/onLoading"
import { useIsConnected } from "react-native-offline";
import OfflineScreen from "../offlineScreen";
import { useNetInfo } from "@react-native-community/netinfo";

const Profile = ({navigation, route}) => {
    const {navigate} = useNavigation()
    const {auth:{user:{token,user_id}},user,setUser,loading,offline, offline:{userData}} = useContext(globContext)
    const [openedUser,setOpenedUser] = useState(undefined)
    const [refreshing, setRefreshing] = useState(false);
    const [loadingUser,setLoadingUser] = useState(true)
    const [workUser,setWorkUser] = useState({clubs : [0]})
    const [load,setLoad] = useState(true)
    
    var {isConnected} = useNetInfo()

    const onRefresh = useCallback(()=>{
        setRefreshing(true)
        fetchInfo(user_id, setUser)
        setRefreshing(false)
    },[])

    const fet = async ()=> {
            await fetchInfo(route.params.user_id,setWorkUser)
           
            setLoad(false)
    }
    useEffect(()=>{
        if(offline.loaded == true){
            console.log(route)
            if(route.params === undefined || route.params.user_id == user_id){
                setWorkUser(userData)
                setLoad(false)
            }
        }
    },[offline])
    useEffect(()=>{
        if(route.params?.user_id){
            if(route.params.user_id == user_id){
                 return;
            }
            fet()
            return;
        }
    },[])


    
    const pos = new Animated.Value(0)
    useEffect(()=>{
        Animated.loop(
        Animated.timing(pos,{
            toValue: 1000,
            duration: 3000,
            useNativeDriver: false
        }),{iterations:-1}).start()
    },[])
    const position = pos.interpolate({
        inputRange: [0,500,1000],
        outputRange:[0,2.,0]
    })
    
    if(openedUser != undefined && isConnected == false ) {
        return (<OfflineScreen/>)
    }

    return (
        <ScrollView refreshControl = {<RefreshControl  refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={{backgroundColor: "#c6d7b9", flexDirection:'row',  alignItems:"center", justifyContent: "space-evenly",paddingBottom:20}}>
                <View style = {{flex:1,alignContent:'flex-start' ,width:"35%", height: 140, marginLeft: 20, marginTop: 40, marginBottom: 10,}}>
                    {load ? <LoadingProfilePhoto size={"100%"} position={position}/>:<ProfileImage size = {140} border = {140} source={workUser.photoPath} style={styles.image}/>}
                </View>
                <View style = {{ width:"53%", marginLeft: 10, marginRight: 10, marginTop: 40, marginBottom: 30, height: 140}}>
                    {load ? <LoadingText height={40} position={position} style={styles.title}/> : <Text style = {[styles.title,]}>{workUser.displayName}</Text>}
                    {load ? <LoadingText lines={2} position={position} containerStyle={styles.text} randomlength={true} style={{margin:0}}/> : 
                        <View style={{height:'70%'}}>
                        <ScrollView nestedScrollEnabled={true}>
                            <Text style = {[styles.text]}>{workUser.bio}</Text>
                        </ScrollView>
                        </View>
                    }
                </View>
            </View>
            <View style={{backgroundColor: "#c6d7b9", flexDirection:'row',  alignItems:"center", justifyContent: "space-evenly"}}>
                    <View style = {styles.border}>
                        <Text style={styles.infoTop}>Wishlist</Text>
                        {loading ? 
                        <LoadingText style={{margin:20, flex: 0, alignSelf:'center'}} width={'50%'} height={33}position={position}/>:
                        <Text style = {styles.infoBott}>{workUser.wishlist}</Text>}
                    </View>
                    <View style = {styles.border}>
                        <Text style={styles.infoTop}>Reading</Text>
                        {loading ? 
                        <LoadingText style={{margin:20, flex: 0, alignSelf:'center'}} width={'50%'} height={33} position={position}/>:
                        <Text style = {styles.infoBott}>{workUser.currently_reading}</Text>
                    }
                    </View>
                    <View style = {styles.border}>
                        <Text style={styles.infoTop}>Completed</Text>
                        {loading ? 
                        <LoadingText style={{margin:20, flex: 0, alignSelf:'center'}} width={'50%'} height={33} position={position}/>:
                        <Text style = {styles.infoBott}>{workUser.completed}</Text>}
                    </View>
            </View>
            <View style={{marginLeft: 20, marginRight: 20}}>
                <Text style={[styles.title, {marginLeft: 0}]}>Bookclubs</Text>
                {workUser.clubs.length == 0 ? <Text style = {styles.name}>{openedUser ? `${workUser.displayName} is` :"You are"} not in any bookclub</Text> : 
                <View>
                    {load ? <LoadingList position={position} size={100} textStyle={styles.name} photoStyle={styles.club} viewStyle={{marginRight: 15}}/> : 
                    <FlatList
                        horizontal
                        scrollEnabled
                        showsHorizontalScrollIndicator={false}
                        data={workUser.clubs}
                        renderItem={({item})=>{
                            return (<TouchableOpacity onPress={()=>{navigation.push('Club',{screen: 'Club_screen', params:{clubID:item.id}})}}>
                            <View style = {{marginRight: 15}}>
                                <ProfileImage size = {100} source={item.photoPath} style={styles.club}/>
                                <Text style={styles.name} key={item.id}>{item.name.length > 8 ? `${item.name.substring(0,6)}...` : item.name}</Text>
                            </View>
                            </TouchableOpacity>)
                        }}
                        keyExtractor={(item)=>item.id}
                    />}
                </View>
                }
            </View>
            <View style={{marginLeft: 20, marginRight: 20, marginBottom: 20}}>
                <Text style={[styles.title, {marginLeft: 0}]}>Recommended books</Text>
                {load ? <HorizontalBookList position={position} size={130} viewStyle={{marginRight: 15}} bookStyle={{marginLeft: 10}}/> :
                workUser.recommended_books.length == 0 ? <Text style = {styles.name}>{openedUser ? `${workUser.displayName} doesn't` :"You don't"} have any recommended books</Text> : 
                    <View>
                        <FlatList
                            horizontal
                            scrollEnabled
                            showsHorizontalScrollIndicator={false}
                            data={workUser.recommended_books}
                            renderItem={({item})=>{
                                return (
                                <TouchableOpacity onPress = {()=>{navigate('ProfileNav', {screen: 'Book', params:{bookID:item.id}})}}>
                                        <View style = {{alignItems: "center", marginRight: 10}}>
                                            <Image source={{uri:item.cover}} style={{width: 120, height: 180, resizeMode: "contain", marginBottom: 5, backgroundColor:'grey'}}/>
                                            <Text style = {{color: "black", marginBottom: 10}}>
                                                {item.title.length > 10 ? `${item.title.substring(0,12)}...` : item.title}
                                            </Text>
                                        </View>
                                </TouchableOpacity>
                               )
                            }}
                            keyExtractor={(item)=>item.id}
                        />
                    </View>
                }
            </View>
            {!load && !openedUser &&
            <ButtonSettings onPress = {()=>{navigate('ProfileNav', {screen: 'Settings'})}} title="Settings"/>}
        </ScrollView>
     )
}

const styles = StyleSheet.create({
    border: {
        borderBottomWidth: 3,
        borderColor: "#5e8d5a",
        borderTopWidth: 3,
        marginBottom: 30,
    },
    infoTop: {
        fontSize: 15,
        color: "black",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 5,
        textAlign: "center",
    },
    infoBott: {
        fontSize: 20,
        color: "black",
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 5,
        textAlign: "center"
    },
    club: {
        overflow: "hidden",
        alignItems: "center"
    },
    image: {
        overflow: "hidden",
        marginBottom: 5,
    },
    title : {
        fontSize: 20,
        fontFamily:'serif',
        color: "black",
        marginTop: 10,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        textAlign: "left",
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 20,
    },
    name: {
        display:'flex',
        flexDirection:'row',
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        textAlign: "center",
        marginTop: 5,
        marginBottom: 20
    }
})

export default Profile