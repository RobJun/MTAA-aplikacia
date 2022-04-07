import { useNavigation } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import {View, Image, Text, StyleSheet, ImageBackground, ScrollView, Searchbar, FlatList, TouchableHighlight} from 'react-native'

const Search = () => {
    const [groups, setGroups] = useState([])
    const [books, setBooks] = useState([])
    const {navigate} = useNavigation()
    
    const fetchGroups = () => {
        fetch("http://10.0.2.2:8000/find/groups/")
        .then(response => response.json())
        .then(data => setGroups(data))
    }

    const fetchBooks = () => {
        fetch("http://10.0.2.2:8000/find/books/")
        .then(response => response.json())
        .then(data => setBooks(data))
    }
    
    useEffect(() => {
        fetchGroups(),
        fetchBooks()
    }, [], [])
    
    //<Searchbar placeholder="Search" value={searchPhrase} onChangeText={setSearchPhrase} onFocus={() => {setClicked(true);}}/>
    return (
        <ScrollView>
            <Text style={styles.text}>Clubs</Text>
            <View style = {{marginLeft: 20}}>
                <FlatList
                    horizontal
                    scrollEnabled
                    showsHorizontalScrollIndicator={false}
                    data={groups}
                    renderItem={({item})=>{
                        return (<TouchableHighlight onPress={()=>{navigate('ClubsNav', {screen:'Club',params:{screen: 'Club_screen',params:{clubID:item.id}}})}}>
                        <View style = {{marginRight: 15}}>
                            <Image source={{uri:item.photoPath}} style={styles.image}/>
                            <Text style={styles.name} key={item.id} onPress={ ()=> Profile} >{item.name}</Text>
                        </View>
                        </TouchableHighlight>)
                    }}
                    keyExtractor={(item)=>item.id}
                />
            </View>
            <Text style={styles.text}>Books</Text>
            <View style = {{marginLeft: 20}}>
                <FlatList
                    columnWrapperStyle={{justifyContent: "space-around"}}
                    numColumns={3}
                    data={books}
                    renderItem={({item})=>{
                        return (
                        <View style = {{marginRight: 15}}>
                            <Image source={{uri:item.cover}} style={{width:  120, height: 180, marginBottom: 10, resizeMode: "contain"}}/>
                        </View>)
                    }}
                    keyExtractor={(item)=>item.id}
                />
            </View>
        </ScrollView>
        )
}

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
        borderRadius: 150 / 2,
        overflow: "hidden",
        alignItems: "center",
      },
    text : {
        display:'flex',
        flexDirection:'row',
        fontSize: 30,
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
    }
})

export default Search