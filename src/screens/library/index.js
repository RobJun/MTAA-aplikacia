import React, { useEffect, useState} from "react"
import {View, Image, Text, StyleSheet, FlatList, ScrollView} from 'react-native'
import Button from "../../components/button"


//kazdy list - ina farba?? wishlist: ee6f68, completed #5e8d5a, reading #f68f3c

function Wishlist() {
    console.log("ahoj")
}

function Completed() {
    console.log("ahoj")
}

function Reading() {
    console.log("ahoj")
}

const Library = () => {
    const [books, setBooks] = useState([])
    
    const fetchBooks = () => {
        fetch("http://10.0.2.2:8000/user/books/reading/?q=312b4905-bdbe-4dc3-a4f5-372636d32840")
        .then(response => response.json())
        .then(data => setBooks(data))
    }
    
    useEffect(() => {
        fetchBooks()
    }, [])

   
    return (
        <ScrollView>
             <View style={{flexDirection:'row',  alignItems:"center", justifyContent: "space-evenly",}}>
                <Button onPress={Wishlist} title="Wishlist"  style = {styles.button}/>
                <Button onPress={Reading} title="Reading" style = {styles.button}/>
                <Button onPress={Completed} title="Completed" style = {styles.button}/>
            </View>
            <View>
                <FlatList
                    scrollEnabled
                    data={books}
                    renderItem={({item})=>{
                        return (
                        <View style = {{flexDirection:'row', flex: 1}}>
                            <View style = {{flexDirection: "row", flex: 1, width: "40%", height: 210, marginLeft:10, marginTop: 20}}>    
                                <Image source={{uri:item.cover_path}} style={styles.image}/>
                            </View>
                            <View style = {{width: "60%", height: 210, marginRight: 10, marginTop: 20, backgroundColor: "#ee6f68", borderTopRightRadius: 30, borderBottomRightRadius: 30}}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.text}>{item.description.substring(0,200)}...</Text>
                            </View>
                        </View>)
                    }}
                    keyExtractor={(item)=>item.id}
                />
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
        width: 150, 
        height: 210, 
        resizeMode: 'contain', 
        marginLeft: 5,
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
        marginLeft: 5,
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
        marginLeft: 5,
        marginRight: 10,
        marginBottom: 10,
    }
})

export default Library