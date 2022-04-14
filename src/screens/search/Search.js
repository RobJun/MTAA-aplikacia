import React, { useEffect, useState} from "react"
import {View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { API_SERVER } from "../../api_calls/constants";
import ProfileImage from "../../components/profileImage";
import BookCover from "../../components/BookCover";
import SearchBar from "react-native-dynamic-search-bar";
import ButtonSettings from "../profile/button";

const SearchScreen = () => {
    const [groups, setGroups] = useState([])
    const [books, setBooks] = useState([])
    const {navigate} = useNavigation()
    const [search,setSearch] = useState("")
    const [searching,setSearching] = useState(false)

    const fetchBooks = async (query) => {
        const response = await fetch(`http://${API_SERVER}/find/books/?q=${query}`)
        setBooks(await response.json())
    }

    const fetchGroups = async (query) => {
        const response = await fetch(`http://${API_SERVER}/find/groups/?q=${query}`)
        const data = await response.json()
        data.forEach(element => {
            element.photoPath = element.photoPath +`?time=${new Date().getTime()}`
        });
        setGroups(data) 
    }

    useEffect(()=>{
        if(search.length < 4 ){
            console.log('string must be atleast 4 characters')
            return;
        }
        if(searching){
            console.log('cant search, search on going')
            return;
        }
        setSearching(true)
        fetchBooks(search)
        fetchGroups(search)
        setSearching(false)
    },[search])
    
    useEffect(() => {
        fetchGroups(''),
        fetchBooks('')
    }, [], [])

    return (
        <View>
        <View>
            <SearchBar 
                placeholder="Search book, author, group..."
                onChangeText={(text) => {setSearch(text)}}
                onClearPress={()=>{
                    fetchGroups('')
                    fetchBooks('')
                }}
                fontSize = {16}
                style = {{width: "95%", marginTop: 15, height: 50, borderRadius: 20}}
            />
        </View>
        <ScrollView style = {{marginBottom: 70}}>
            <Text style={styles.text}>Bookclubs</Text>
                <View style = {{marginLeft: 20}}>
                {groups.length === 0 ?
                    (<View><Text style = {[styles.name, {fontWeight: "normal"}]}>No results</Text> 
                    <ButtonSettings onPress = {()=>{navigate()}} title="Create new bookclub"/></View>) : 
                    <FlatList
                        horizontal
                        scrollEnabled
                        showsHorizontalScrollIndicator={false}
                        data={groups}
                        renderItem={({item})=>{
                            return (<TouchableOpacity onPress={()=>{navigate('SearchNav', {screen:'Club', params:{screen: 'Club_screen', params:{clubID:item.id}}})}}>
                            <View style = {{marginRight: 15}}>
                                <ProfileImage size = {100} source={item.photoPath} style={styles.image}/>
                                <Text style={styles.name} key={item.id}>{item.name.length > 8 ? `${item.name.substring(0,6)}...` : item.name}</Text>
                            </View>
                            </TouchableOpacity>)
                        }}
                        keyExtractor={(item)=>item.id}
                    />
                }
            </View>
            <Text style={styles.text}>Books</Text>
            <View style = {{marginLeft: 20}}>
                {books.length === 0 ?
                    <Text style = {[styles.name, {fontWeight: "normal"}]}>No results</Text> : 
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
                }
            </View>
        </ScrollView>
        </View>
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