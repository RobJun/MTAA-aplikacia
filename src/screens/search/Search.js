import React, { useEffect, useState} from "react"
import {View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity,Animated, Image} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { API_SERVER } from "../../api_calls/constants";
import ProfileImage from "../../components/profileImage";
import SearchBar from "react-native-dynamic-search-bar";
import ButtonSettings from "../profile/button";
import { BookSearchList, LoadingList } from "../../components/onLoading";

const SearchScreen = () => {
    const [groups, setGroups] = useState([])
    const [books, setBooks] = useState([])
    const {navigate} = useNavigation()
    const [search,setSearch] = useState("")
    const [searching,setSearching] = useState(true)

    const fetchBooks = async (query) => {
        try {
            const response = await fetch(`http://${API_SERVER}/find/books/?q=${query}`)
            setBooks(await response.json())
        } catch {
            alert("Error - no internet connection")
        }
    }

    const fetchGroups = async (query) => {
        try {
            const response = await fetch(`http://${API_SERVER}/find/groups/?q=${query}`)
            const data = await response.json()
            data.forEach(element => {
                element.photoPath = element.photoPath +`?time=${new Date().getTime()}`
            });
            setGroups(data)
        } catch {
            alert("Error - no internet connection")
        }
    }

    const fet = async (query) => {
        setSearching(true)
        await fetchBooks(query)
        await fetchGroups(query)
        setSearching(false)
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
        fet(search)
    },[search])
    
    useEffect(() => {
        fet('')
    }, [], [])

    const pos = new Animated.Value(0)
    useEffect(()=>{
        Animated.loop(
        Animated.timing(pos,{
            toValue: 1000,
            duration: 3000,
            useNativeDriver: false
        }),{iterations:-1}).start()
    },[])
    const position = pos.interpolate({
        inputRange: [0,500,1000],
        outputRange:[0,2.,0]
    })


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
                {searching ? <LoadingList position={position} size={100} photoStyle={styles.image} viewStyle={{marginRight: 15}} textStyle={styles.name}/> :
                groups.length === 0 ?
                    (<View><Text style = {[styles.name, {fontWeight: "normal"}]}>No results</Text> 
                    <ButtonSettings onPress = {()=>{navigate('ClubsNav',{screen: 'Create_Club',params:{clubName : search.substring(0,20)}})}} title="Create new bookclub"/></View>) : 
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
            <View style = {{marginLeft: 15}}>
                {searching ? <BookSearchList position={position} coverStyle={{marginBottom: 10}} size={120}/> :
                books.length === 0 ?
                    <Text style = {[styles.name, {fontWeight: "normal"}]}>No results</Text> : 
                    <FlatList
                        scrollEnabled
                        columnWrapperStyle={{justifyContent: "space-around"}}
                        numColumns={3}
                        data={books}
                        renderItem={({item})=>{ return (
                            <View style = {{marginRight: 15}}>
                                <TouchableOpacity onPress = {()=>{navigate('SearchNav', {screen: 'Book', params:{bookID:item.id}})}} >
                                    <Image source={{uri:item.cover}} style={{width: 120, height: 180, resizeMode: "contain", marginBottom: 10}}/>
                                </TouchableOpacity>
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