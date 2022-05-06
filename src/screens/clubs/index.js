import { useNavigation } from "@react-navigation/native"
import React, {useContext,useEffect,useState, useCallback} from "react"
import {View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, Animated, RefreshControl, Dimensions} from 'react-native'
import ButtonNewClub from "./buttonNewClub."
import { globContext } from "../../context/globContext";
import ProfileImage from "../../components/profileImage";
import { VerticalClubList } from "../../components/onLoading";
import Fontisto from  'react-native-vector-icons/Fontisto'
import { fetchGroups } from "../../api_calls/user_calls";
import {useNetInfo} from '@react-native-community/netinfo'

const Clubs = () => {
    const {auth:{user:{token,user_id}},groups,setGroups,loading,offline:{userData:{clubs}}} = useContext(globContext)
    const {navigate} = useNavigation()
    const [refreshing, setRefreshing] = useState(false);
    const {isConnected} = useNetInfo()
    const onRefresh = useCallback(()=>{
        setRefreshing(true)
        if(is)
        fetchGroups(user_id, setGroups)
        setRefreshing(false)
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
    console.log(groups)

    return (
        <ScrollView refreshControl = {<RefreshControl  refreshing={refreshing} onRefresh={onRefresh} />}>
             <View style={{marginTop: 20, marginBottom: 20, flexDirection:'row', justifyContent: "space-between", marginLeft: 20}}>
                <Text style = {styles.title1}>My bookclubs</Text>
                <ButtonNewClub onPress={()=>{navigate('ClubsNav',{screen:'Create_Club'})}} title="+"/>
            </View>
            <View>
                {loading ? <VerticalClubList position={position} size={100}/> : (
                clubs.length === 0 ? (<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex: 1, alignItems: "center", width: "100%", height: Dimensions.get('window').height - 140}}>
                        <Image source={require('../../../assets/club.png')} style={styles.frog}></Image>
                    </View></View>): 
                <FlatList
                    scrollEnabled
                    data={clubs}
                    renderItem={({item})=>{
                        return (
                        <TouchableOpacity onPress={()=>{navigate('ClubsNav', {screen:'Club', params:{screen: 'Club_screen', params:{clubID:item.id}}})}}>
                            <View style = {{flexDirection:'row', marginBottom: 20}}>
                                <View style = {{flexDirection: "row", flex: 1, width: "35%", marginLeft:15, backgroundColor: "#f17c56", borderTopLeftRadius: 360, borderBottomLeftRadius: 360}}>  
                                    <ProfileImage size = {100} source={item.photoPath} style={styles.image}/>
                                </View>
                                <View style = {{width: "65%", marginRight: 20, backgroundColor: "#f17c56", borderTopRightRadius: 20, borderBottomRightRadius: 20}}>
                                    <Text numberOfLines={1} style={styles.title}>{item.name}</Text>
                                    <Text style={styles.text}>Number of members: {item.number_of_members}</Text>
                                </View>
                                </View>
                        </TouchableOpacity>)
                    }}
                    keyExtractor={(item)=>item.id}
                />) }
            </View>
        </ScrollView>
    )
 }

 const styles = StyleSheet.create({
    frog: {
        position: "absolute", 
        bottom: 0, 
        alignSelf: "flex-end"
    },
    club: {
        width: 100,
        height: 100,
        borderRadius: 150 / 2,
        overflow: "hidden",
        marginLeft: 20,
        alignItems: "center"
    },
    image: {
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "#f17c56", 
    },
    title1 : {
        fontSize: 25,
        fontFamily:'serif',
        color: "black",
        marginTop: 15,
        marginRight: 10,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    title : {
        fontSize: 20,
        fontFamily:'serif',
        color: "black",
        marginTop: 15,
        marginRight: 10,
        marginLeft: 15,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        textAlign: "left",
        marginLeft: 15,
        marginRight: 10,
    }
})

export default Clubs