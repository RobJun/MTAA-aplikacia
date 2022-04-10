import React, { useEffect, useState, useContext} from "react"
import {View, Image, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { globContext } from "../../context/globContext";
import { API_SERVER } from "../../api_calls/constants";
import ProfileImage from "../../components/profileImage";
import BookCover from "../../components/BookCover";

const HomeScreen = () => {
    const {auth:{user:{token,user_id}},groups,library:{reading}} = useContext(globContext)
    const {navigate} = useNavigation();


    return (
        <ScrollView>
            <View style = {{height: 260}}>
                <Image source={require('../../../assets/home.jpg')} style={styles.image}></Image>
            </View>
            <Text style = {styles.text}>You're currently reading...</Text>
            <View style = {{marginRight: 20}}>
                { reading.length == 0 ? <Text style = {[styles.name, {fontWeight: "normal"}]}>You are not reading anything right now</Text> : 
                    <FlatList
                        horizontal
                        scrollEnabled
                        showsHorizontalScrollIndicator={false}
                        data={reading}
                        renderItem={({item})=>{
                            return (<View>
                                <BookCover onPress = {()=>{navigate('LibraryNav', {screen:'Book', params:{bookID:item.id}})}} 
                                source = {item.cover_path} size =  {120} style = {{marginLeft: 20}}/>   
                                </View>)
                        }}
                        keyExtractor={(item)=>item.id}
                    /> }
            </View>
            <Text style = {styles.text}>Your bookclubs</Text>
            <View style = {{marginRight: 20}}>
                { groups.length == 0 ? <Text style = {[styles.name, {fontWeight: "normal"}]}>You are not in any bookclub</Text> : 
                    <FlatList
                        horizontal
                        scrollEnabled
                        showsHorizontalScrollIndicator={false}
                        data={groups}
                        renderItem={({item})=> {
                            return (
                                <TouchableOpacity onPress={()=>{navigate('ClubsNav', {screen:'Club', params:{screen: 'Club_screen', params:{clubID:item.id}}})}}>
                                <View style = {{marginLeft: 10, alignItems: "center"}}>
                                    <ProfileImage size = {100} source={item.photoPath} style={styles.club}/>
                                    <Text style={styles.name} key={item.id}>{item.name.length > 8 ? `${item.name.substring(0,6)}...` : item.name}</Text>
                                </View>
                                </TouchableOpacity>)}}
                        keyExtractor={(item)=>item.id}
                    /> 
                }
            </View>
        </ScrollView>
    )
 }

 const styles = StyleSheet.create({
    club: {
        borderRadius: 150 / 2,
        overflow: "hidden",
        marginLeft: 20,
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
        marginLeft:20,
        marginBottom: 20
    }
})

export default HomeScreen