import React, { useEffect, useState, useContext } from "react"
import {View, Image, Text, StyleSheet, ScrollView} from 'react-native'
import Button from "../../components/button"
import { API_SERVER } from "../../api_calls/constants";
import { globContext } from "../../context/globContext";


function putToRecommended() {
    console.log("ahoj")
}

const BookProfile = ({route}) => {
    const {auth:{user:{token,user_id}}} = useContext(globContext)
    const bookID = route.params.bookID
    const [category, setCategory] = useState("Add to Library")
    const [info, setInfo] = useState({
        genre: { 
            color: 0xffffff00
        },
        author:[
            {
                name: "Text",
            },
        ],
        description: "text"})
    
    const fetchInfo = () => {
        fetch(`http://${API_SERVER}/find/info/${bookID}/`)
        .then(response => response.json())
        .then(data => setInfo(data))
    }

    const putToLibrary = async (where) => {
        const response = await fetch(`http://${API_SERVER}/user/book/${bookID}/?q=${where}`,{
            "method": "PUT",
            "headers" : {
            "Authorization" : "Token " + token
            }
        })
        if (response.status === 401 || response.status === 404 || response.status === 406 || response.status === 409){
            alert('error')
            return;
        }
        const data = await response.json()
        setInfo(data)
        setCategory("In" + where)
    }

    useEffect(() => {
        fetchInfo()
    }, [])
    
    const c = 0xffffffff
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{backgroundColor: `rgb(${((info.genre.color & 0xff000000)>>24)& 0xff},${(info.genre.color & 0x00ff0000)>>16},${(info.genre.color & 0x0000ff00)>>8})`, alignItems:"center"}}>
                <Image source={{uri:info.cover}} style={ styles.image}/>
                <Text style = {styles.title}> {info.author[0].name} : {info.title}</Text>
                <View style={{flexDirection:'row'}}>
                    <View style = {styles.border}>
                        <Text style={styles.infoTop}>Rating</Text>
                        <Text style = {styles.infoBott}>{info.rating}</Text>
                    </View>
                    <View style = {styles.border}>
                        <Text style={styles.infoTop}>Genre</Text>
                        <Text style = {styles.infoBott}>{info.genre.name}</Text>
                    </View>
                    <View style = {styles.border}>
                        <Text style={styles.infoTop}>Pages</Text>
                        <Text style = {styles.infoBott}>{info.pages}</Text>
                    </View>
                </View>
            </View>
            <View style={{flexDirection:'row',  alignItems:"center", justifyContent: "space-evenly"}}>
                <Button onPress={() => putToLibrary("wishlist")} title = {category} style = {styles.button}/>
                <Button onPress={putToRecommended} title="Recommend" color="#841584" accessibilityLabel="Learn more about this purple button" style = {styles.button}/>
            </View>
            <View >

                <Text style = {{fontSize: 20, fontWeight: "bold", marginTop: 10, marginLeft: 10, color: "black"}}>About</Text>
                <Text style = {styles.text}>{info.description}</Text>
            </View>
        </ScrollView>
    )
 }

const styles = StyleSheet.create({
    border: {
        borderBottomWidth: 2,
        borderColor: "white",
        borderTopWidth: 2,
        marginBottom: 30,
        marginLeft: 10,
        marginRight: 10
    },
    infoTop: {
        fontSize: 20,
        color: "black",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        textAlign: "center",
        fontWeight: "500"
    },
    infoBott: {
        fontSize: 20,
        color: "black",
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        textAlign: "center"
    },
    image: {
        width:  240, 
        height: 300, 
        margin: 20, 
        resizeMode: 'contain'
    },
    text : {
        display:'flex',
        flexDirection:'row',
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        letterSpacing: 1,
        lineHeight: 25,
        margin: 10,
        marginBottom: 30
    },
    title: {
        display:'flex',
        flexDirection:'row',
        fontSize: 22,
        fontFamily:'serif',
        color: "black",
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: "center",
        marginLeft: 10,
        marginRight: 10
    },
})

export default BookProfile