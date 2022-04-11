import React, {useContext, useState} from "react"
import {View, Image, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity} from 'react-native'
import ButtonLibrary from "./button"
import { globContext } from "../../context/globContext";
import { useNavigation } from '@react-navigation/native';

const Library = () => {
    const {navigate} = useNavigation()
    const {auth:{user:{token,user_id}},library} = useContext(globContext)
    const [wishlistColor, setWishlistColor] = useState("grey")
    const [readingColor, setReadingColor] = useState("#f17c56") 
    const [completedColor, setCompletedColor] = useState("grey")  
    const [bgColor, setBColor] = useState("#f17c56") 
    const [which,setWhich] = useState('reading')

    
    const changeLibrary = (which, color1, color2, color3) => {
        setWhich(which)
        setWishlistColor(color1)
        setReadingColor(color2)
        setCompletedColor(color3)
        if (which === "wishlist") setBColor(color1)
        if (which === "reading") setBColor(color2)
        if (which === "completed") setBColor(color3)
    }

    return (
        <ScrollView>
             <View style={{flexDirection:'row',  alignItems:"center", justifyContent: "space-evenly", marginLeft: 20, marginRight: 20}}>
                <ButtonLibrary onPress={()=>{changeLibrary("wishlist", "#ffc04a", "grey", "grey")}} title="Wishlist" color={wishlistColor}/>
                <ButtonLibrary onPress={()=>{changeLibrary("reading", "grey", "#f17c56", "grey")}} title="Reading" color ={readingColor}/>
                <ButtonLibrary onPress={()=>{changeLibrary("completed", "grey", "grey", "#ee6f68")}} title="Completed" color ={completedColor}/>
            </View>
            <View>
                {library[which].length == 0 ? <Text style = {[styles.text, {marginTop: 20}]}>You don't have any book in this category</Text> : 
                    <FlatList
                        scrollEnabled
                        data={library[which]}
                        extraData={library}
                        renderItem={({item})=>{
                            return ( 
                            <TouchableOpacity onPress={()=>{navigate('LibraryNav', {screen:'Book', params:{bookID:item.id}})}}>
                                <View style = {{flexDirection:'row', flex: 1}}>
                                    <View style = {{flexDirection: "row", flex: 1, width: "40%", height: 210, marginLeft:10, marginTop: 20}}>    
                                        <Image source={{uri:item.cover_path}} style={styles.image}/>
                                    </View>
                                    <View style = {{width: "60%", height: 210, marginRight: 20, marginTop: 20, backgroundColor: bgColor, borderTopRightRadius: 20, borderBottomRightRadius: 20}}>
                                        <Text style={styles.title}>{item.title}</Text>
                                        <Text style={styles.text}>{item.description.substring(0,150)}...</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>)
                        }}
                        keyExtractor={(item)=>item.id}
                        />
                }
            </View>
        </ScrollView>
    )
 }

 const styles = StyleSheet.create({
    club: {
        width: 100,
        height: 100,
        borderRadius: 150 / 2,
        overflow: "hidden",
        marginLeft: 20,
        alignItems: "center"
    },
    image: {
        width: 135, 
        height: 210, 
        resizeMode: 'contain', 
        marginBottom: 5,
        borderWidth:5,
    },
    title : {
        flex: 1, 
        flexWrap: 'wrap', 
        fontSize: 18,
        fontFamily:'serif',
        color: "black",
        marginTop: 15,
        marginRight: 10,
        marginLeft: 15,
        fontWeight: 'bold',
    },
    text: {
        flex: 3,
        display:'flex',
        flexDirection:'row',
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        textAlign: "left",
        marginLeft: 15,
        marginRight: 10,
        marginBottom: 10,
    }
})

export default Library