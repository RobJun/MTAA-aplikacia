import React, { useEffect, useState } from "react"
import {View, Image, Text, StyleSheet, ImageBackground, ScrollView, Searchbar} from 'react-native'
import { FlatList } from "react-native-gesture-handler"

const Search = () => {
    const [groups, setGroups] = useState([])
    const [books, setBooks] = useState([])
    
    const fetchGroups = () => {
        fetch("http://10.0.2.2:8000/find/groups/")
        .then(response => response.json())
        .then(data => setGroups(data))
    }

    const fetchBooks = () => {
        fetch("http://10.0.2.2:8000/find/books/")
        .then(response => response.json())
        .then(data => setBooks(data))
        .then(data => console.log(data))
    }
    
    useEffect(() => {
        fetchGroups(),
        fetchBooks()
    }, [], [])
    console.log('dsdsd')
    //<Searchbar placeholder="Search" value={searchPhrase} onChangeText={setSearchPhrase} onFocus={() => {setClicked(true);}}/>
    return (
        <View>
            <Text style={styles.text}>Clubs</Text>
            <View>
                <FlatList
                    horizontal
                    scrollEnabled
                    data={groups}
                    renderItem={({item})=>{
                        console.log(item)
                        return (<View>
                            <Image source={{uri:item.photoPath}} style={{width: 100, height: 100}}/>
                            <Text style={styles.titles} key={item.id} onPress={ ()=> Profile} >{item.name}</Text>
                        </View>)
                    }}
                    keyExtractor={(item)=>item.id}
                />
            </View>
            <Text style={styles.text}>Books</Text>
            <ScrollView horizontal = {true} style={containerStyle.rowContainer} showsHorizontalScrollIndicator={false}>
                {books.filter((x, index) => index < 5).map(book => (
                    <ImageBackground key={book.id}>{book.cover}</ImageBackground>,
                    <Text style={styles.titles} key={book.id}>{book.title}</Text>
                ))}
            </ScrollView>
            <ScrollView horizontal = {true} style={containerStyle.rowContainer} showsHorizontalScrollIndicator={false}>
                {books.filter((x, index) => 5 <= index & index < 10).map(book => (
                    <ImageBackground key={book.id}>{book.cover}</ImageBackground>,
                    <Text style={styles.titles} key={book.id}>{book.title}</Text>
                ))}
            </ScrollView>
            <ScrollView horizontal = {true} style={containerStyle.rowContainer} showsHorizontalScrollIndicator={false}>
                {books.filter((x, index) => 10 <= index & index < 15).map(book => (
                    <ImageBackground key={book.id}>{book.cover}</ImageBackground>,
                    <Text style={styles.titles} key={book.id}>{book.title}</Text>
                ))}
            </ScrollView>
            <ScrollView horizontal = {true} style={containerStyle.rowContainer} showsHorizontalScrollIndicator={false}>
                {books.filter((x, index) => 15 <= index & index < 20).map(book => (
                    <ImageBackground key={book.id}>{book.cover}</ImageBackground>,
                    <Text style={styles.titles} key={book.id}>{book.title}</Text>
                ))}
            </ScrollView>
            <ScrollView horizontal = {true} style={containerStyle.rowContainer} showsHorizontalScrollIndicator={false}>
                {books.filter((x, index) => 20 <= index & index < 25).map(book => (
                    <ImageBackground key={book.id}>{book.cover}</ImageBackground>,
                    <Text style={styles.titles} key={book.id}>{book.title}</Text>
                ))}
            </ScrollView>
            <ScrollView horizontal = {true} style={containerStyle.rowContainer} showsHorizontalScrollIndicator={false}>
                {books.filter((x, index) => 25 <= index & index< 30).map(book => (
                    <ImageBackground key={book.id}>{book.cover}</ImageBackground>,
                    <Text style={styles.titles} key={book.id}>{book.title}</Text>
                ))}
            </ScrollView>
            <ScrollView horizontal = {true} style={containerStyle.rowContainer} showsHorizontalScrollIndicator={false}>
                {books.filter((x, index) => 30 <= index & index < 35).map(book => (
                    <ImageBackground key={book.id}>{book.cover}</ImageBackground>,
                    <Text style={styles.titles} key={book.id}>{book.title}</Text>
                ))}
            </ScrollView>
            <ScrollView horizontal = {true} style={containerStyle.rowContainer} showsHorizontalScrollIndicator={false}>
                {books.filter((x, index) => 35 <= index & index < 40).map(book => (
                    <ImageBackground key={book.id}>{book.cover}</ImageBackground>,
                    <Text style={styles.titles} key={book.id}>{book.title}</Text>
                ))}
            </ScrollView>
        </View>
        )
}

const containerStyle = StyleSheet.create({
    container: {
      padding: 8,
      backgroundColor: "#ffffff",
    },
    rowContainer: {
      flexDirection: 'row',
    }
  }); 

const styles = StyleSheet.create({
    photos: {
        width: '10%',
        height: '10%'
    },
    text : {
        display:'flex',
        flexDirection:'row',
        fontSize: 30,
        fontFamily:'serif',
        color: "black",
        marginTop: 30,
        marginLeft: 20,
        fontWeight: 'bold',
    },
    titles: {
        display:'flex',
        flexDirection:'row',
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        marginTop: 30,
        marginLeft: 20,
        fontWeight: 'bold',
    }
})

export default Search