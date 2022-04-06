import React, {useEffect, useState} from "react"
import {View,Image,Text,StyleSheet, ScrollView, FlatList} from 'react-native'
import ButtonSettings from "./button"

function settings() {
    console.log("ahoj")
}

const Profile = () => {
    const [info, setInfo] = useState([])
    
    const fetchInfo = () => {
        fetch("http://10.0.2.2:8000/user/info/?q=312b4905-bdbe-4dc3-a4f5-372636d32840")
        .then(response => response.json())
        .then(data => setInfo(data))
    }
    
    useEffect(() => {
        fetchInfo()
    }, [])

     return (
        <ScrollView>
            <View style={{backgroundColor: "#c6d7b9", flexDirection:'row',  alignItems:"center", justifyContent: "space-evenly"}}>
                <View style = {{width:"40%", height: 130, marginLeft: 20, marginTop: 20, marginBottom: 20}}>
                    <Image source={{uri:info.photoPath}} style={styles.image}/>
                </View>
                <View style = {{width:"60%", marginRight: 20, marginTop: 20, marginBottom: 20, height: 130}}>
                    <Text style = {styles.title}>{info.displayName}</Text>
                    <Text style = {styles.text}>Tu ma byt bio max 100 znakov</Text>
                </View>
            </View>
            <View style={{backgroundColor: "#c6d7b9", flexDirection:'row',  alignItems:"center", justifyContent: "space-evenly"}}>
                    <View style = {styles.border}>
                        <Text style={styles.infoTop}>Wishlist</Text>
                        <Text style = {styles.infoBott}>{info.wishlist}</Text>
                    </View>
                    <View style = {styles.border}>
                        <Text style={styles.infoTop}>Reading</Text>
                        <Text style = {styles.infoBott}>{info.currently_reading}</Text>
                    </View>
                    <View style = {styles.border}>
                        <Text style={styles.infoTop}>Completed</Text>
                        <Text style = {styles.infoBott}>{info.completed}</Text>
                    </View>
            </View>
            <View style={{marginLeft: 20, marginRight: 20}}>
                <Text style={styles.title}>Clubs</Text>
                <View>
                    <FlatList
                        horizontal
                        scrollEnabled
                        showsHorizontalScrollIndicator={false}
                        data={info.clubs}
                        renderItem={({item})=>{
                            return (<View style = {{marginRight: 15}}>
                                <Image source={{uri:item.photoPath}} style={styles.club}/>
                                <Text style={styles.name} key={item.id} onPress={ ()=> Profile} >{item.name}</Text>
                            </View>)
                        }}
                        keyExtractor={(item)=>item.id}
                    />
                </View>
            </View>
            <View style={{marginLeft: 20, marginRight: 20, marginBottom: 20}}>
                <Text style={styles.title}>Recommended books</Text>
                <View>
                    <FlatList
                        horizontal
                        scrollEnabled
                        showsHorizontalScrollIndicator={false}
                        data={info.recommended_books}
                        renderItem={({item})=>{
                            return (<View style = {{marginRight: 15}}>
                                <Image source={{uri:item.cover}} style={styles.book}/>
                            </View>)
                        }}
                        keyExtractor={(item)=>item.id}
                    />
                </View>
            </View>
            <ButtonSettings onPress={settings} title="Settings"/>
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
        fontSize: 17,
        color: "black",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        textAlign: "center",
        
    },
    infoBott: {
        fontSize: 25,
        color: "black",
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        textAlign: "center"
    },
    club: {
        width: 100,
        height: 100,
        borderRadius: 150 / 2,
        overflow: "hidden",
        alignItems: "center"
    },
    book: {
        width: 130,
        height: 200,
        resizeMode: 'contain',
    },
    image: {
        width: 130, 
        height: 130, 
        borderRadius: 360 / 2,
        overflow: "hidden",
        marginLeft: 10,
        marginBottom: 5,
    },
    title : {
        fontSize: 20,
        fontFamily:'serif',
        color: "black",
        marginTop: 5,
        marginRight: 10,
        marginLeft: 5,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        textAlign: "left",
        marginLeft: 5,
        marginRight: 10,
        marginBottom: 10,
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