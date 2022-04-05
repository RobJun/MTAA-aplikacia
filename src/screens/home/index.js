import React, { useEffect, useState} from "react"
import {View, Image, Text, StyleSheet, FlatList, ScrollView} from 'react-native'

const HomeScreen = () => {
    const [groups, setGroups] = useState([])
    const [books, setBooks] = useState([])
    
    const fetchGroups = () => {
        fetch("http://10.0.2.2:8000/user/groups/?q=312b4905-bdbe-4dc3-a4f5-372636d32840")
        .then(response => response.json())
        .then(data => setGroups(data))
    }

    const fetchBooks = () => {
        fetch("http://10.0.2.2:8000/user/books/reading/?q=312b4905-bdbe-4dc3-a4f5-372636d32840")
        .then(response => response.json())
        .then(data => setBooks(data))
    }
    
    useEffect(() => {
        fetchBooks(),
        fetchGroups()
    }, [], [])

   
    return (
        <ScrollView>
            <View style = {{height: 260}}>
                <Image source={require('../../../assets/home.jpg')} style={styles.image}></Image>
            </View>
            <Text style = {styles.text}>You're currently reading...</Text>
            <View>
                <FlatList
                    horizontal
                    scrollEnabled
                    showsHorizontalScrollIndicator={false}
                    data={books}
                    renderItem={({item})=>{
                        return (<View>
                            <Image source={{uri:item.cover_path}} style={{width: 120, height: 180, resizeMode: 'contain', marginLeft: 20}}/>
                        </View>)
                    }}
                    keyExtractor={(item)=>item.id}
                />
            </View>
            <Text style = {styles.text}>Your bookclubs</Text>
            <View>
                <FlatList
                    horizontal
                    scrollEnabled
                    showsHorizontalScrollIndicator={false}
                    data={groups}
                    renderItem={({item})=>{
                        return (<View>
                            <Image source={{uri:item.photoPath}} style={styles.club}/>
                            <Text style={styles.name} key={item.id} onPress={ ()=> Profile} >{item.name}</Text>
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
        marginLeft: 25,
        marginBottom: 20
    }
})

export default HomeScreen