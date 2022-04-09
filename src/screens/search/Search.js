import React, { useEffect, useState } from "react"
import {View, Text, StyleSheet, ScrollView, Searchbar, FlatList, TouchableOpacity} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { API_SERVER } from "../../api_calls/constants";
import ProfileImage from "../../components/profileImage";
import BookCover from "../../components/BookCover";

const SearchScreen = () => {
    const [groups, setGroups] = useState([])
    const [books, setBooks] = useState([])
    const {navigate} = useNavigation()
    
    const fetchGroups = () => {
        fetch(`http://${API_SERVER}/find/groups/`)
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                element.photoPath = element.photoPath +`?time=${new Date().getTime()}`
            });
            setGroups(data)
        })
    }

    const fetchBooks = () => {
        fetch(`http://${API_SERVER}/find/books/`)
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
                        return (<TouchableOpacity onPress={()=>{navigate('SearchNav', {screen:'Club', params:{screen: 'Club_screen', params:{clubID:item.id}}})}}>
                        <View style = {{marginRight: 15}}>
                            <ProfileImage size = {100} source={item.photoPath} style={styles.image}/>
                            <Text style={styles.name} key={item.id} >{item.name}</Text>
                        </View>
                        </TouchableOpacity>)
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
                    renderItem={({item})=>{ return (
                        <View style = {{marginRight: 15}}>
                            <BookCover onPress = {()=>{navigate('SearchNav', {screen: 'Book', params:{bookID:item.id}})}} 
                                source = {item.cover} size =  {120} style = {{marginBottom: 10}}/>   
                        </View>
                    ) 
                    }}
                    keyExtractor={(item)=>item.id}
                />
            </View>
        </ScrollView>
        )
}

const styles = StyleSheet.create({
    image: {
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

export default SearchScreen