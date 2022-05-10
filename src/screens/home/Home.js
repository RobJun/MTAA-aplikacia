import React, { useEffect, useState, useContext,useCallback} from "react"
import {View, Image, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,Animated, RefreshControl} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { globContext } from "../../context/globContext";
import ProfileImage from "../../components/profileImage";
import BookCover from "../../components/BookCover";
import { fetchBooks, fetchGroups } from "../../api_calls/user_calls";
import { LoadingList,HorizontalBookList } from "../../components/onLoading";

const HomeScreen = ({navigation}) => {
    const {auth:{user:{token,user_id}},groups, setGroups,loading,setLibrary,offline:{reading,userData:{clubs}},auth} = useContext(globContext)
    const {navigate} = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(()=>{
        setRefreshing(true)
        try {
        fetchGroups(user_id, setGroups)
        fetchBooks(user_id,(books)=>{setLibrary((prev)=>{return {...prev , reading : books}})},"reading")
        } catch (err) {
           
        }
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
   
    return (
        <ScrollView refreshControl = {<RefreshControl  refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style = {{height: 260}}>
                <Image source={require('../../../assets/home.jpg')} style={styles.image}></Image>
            </View>
            <View style = {{marginRight: 20}}>
                <Text style = {styles.text}>You're currently reading...</Text>
                {loading ? <HorizontalBookList position={position} size={150} bookStyle={{marginLeft: 20}}/> : 
                    reading.length == 0 ? <Text style = {[styles.name, {fontWeight: "normal"}]}>You are not reading anything right now</Text> : 
                    <FlatList
                        horizontal
                        scrollEnabled
                        showsHorizontalScrollIndicator={false}
                        data={reading}
                        renderItem={({item})=>{
                            return (
                                <TouchableOpacity onPress = {()=>{navigation.navigate('Book',{bookID:item.id})}}>
                                        <View style = {{alignItems: "center", marginLeft: 20}}>
                                            <Image source={{uri:item.cover_path}} style={{width: 150, height: 230, resizeMode: "contain", marginBottom: 5, backgroundColor:'grey'}}/>
                                            <Text style = {{color: "black", marginBottom: 10}}>
                                                {item.title.length > 10 ? `${item.title.substring(0,17)}...12345678910` : item.title}
                                            </Text>
                                        </View>
                                </TouchableOpacity>
                        )}}
                        keyExtractor={(item)=>item.id}
                    /> }
            </View>
            <View style = {{marginRight: 20}}>
                <Text style = {styles.text}>Your bookclubs</Text>
                {loading ? <LoadingList 
                        position={position}
                        size={100} 
                        viewStyle={{marginLeft: 10, alignItems: "center"}}
                        photoStyle={styles.club}
                        textStyle={styles.name} /> : (
                 clubs.length == 0 ? <Text style = {[styles.name, {fontWeight: "normal"}]}>You are not in any bookclub</Text> : 
                    <FlatList
                        horizontal
                        scrollEnabled
                        showsHorizontalScrollIndicator={false}
                        data={clubs}
                        renderItem={({item})=> {
                            return (
                                <TouchableOpacity onPress={()=>{navigation.navigate('Club',{screen: 'Club_screen', params:{clubID:item.id}})}}>
                                <View style = {{marginLeft: 20, alignItems: "center"}}>
                                    <ProfileImage size = {100} source={item.photoPath} style={styles.club}/>
                                    <Text style={styles.name} key={item.id}>{item.name.length > 8 ? `${item.name.substring(0,6)}...` : item.name}</Text>
                                </View>
                                </TouchableOpacity>)}}
                        keyExtractor={(item)=>item.id}
                    /> )
                }
            </View>
        </ScrollView>
    )
 }

 const styles = StyleSheet.create({
    club: {
        borderRadius: 150 / 2,
        overflow: "hidden",
        alignItems: "center"
    },
    image: {
        width: "100%",
        height: "100%",
        paddingBottom: 50
    },
    text : {
        display:'flex',
        flexDirection:'row',
        fontSize: 20,
        fontFamily:'serif',
        color: "black",
        marginTop: 20,
        marginLeft: 20,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    name: {
        display:'flex',
        flexDirection:'row',
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        textAlign: "center",
        fontWeight: 'bold',
        marginBottom: 20
    }
})

export default HomeScreen