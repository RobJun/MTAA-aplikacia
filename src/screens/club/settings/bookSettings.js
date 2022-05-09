import React,{useContext,useState,useEffect} from "react";
import {View,Text,FlatList,Image} from 'react-native'
import { clubContext } from "../index";
import { API_SERVER } from "../../../api_calls/constants";
import Button from "../../../components/button";
import { globContext } from "../../../context/globContext";
import SearchBar from "react-native-dynamic-search-bar";
import BookCover from "../../../components/BookCover";
import { styles } from "./style";
import { useNetInfo } from "@react-native-community/netinfo";
import { set_book_of_week } from "../../../context/actions/offline";


const BookSettings = ({club_id})=> {
    const {info, setInfo} = useContext(clubContext)
    const {auth:{user:{token,user_id}},setAuth,offline,setOffline} = useContext(globContext)
    const [book,setBook] = useState(false)
    const [search,setSearch] = useState("")
    const [searchResult,setSearchResult] = useState([])
    const [searching,setSearching] = useState(false)
    const [setting,setSetting] = useState(false)
    const {isConnected} = useNetInfo()

    const fetchBooks = async (query) => {
        setSearching(true)
        const response = await fetch(`http://${API_SERVER}/find/books/?q=${query}`)
        setSearchResult(await response.json())
        setSearching(false)
    }

    useEffect(()=>{
        if(search.length < 4 ){
           
            return;
        }
        if(searching){
           
            return;
        }
        if(isConnected){
            fetchBooks(search)
        }

    },[search])

    useEffect(()=>{
       
        var a = []
        if(!isConnected){
        for (const key in offline.user_book_profiles){
            a.push(offline.user_book_profiles[key])
        }
        setSearchResult(a)
    }
    },[isConnected])

    const onSelect = (item) => {
        if(book === false){
            setBook(item)
            return
        }
        if(book.id === item.id){
            setBook(false)
            return
        }
        setBook(item)
    } 
    const onSubmit=  async ()=>{
        if(book === false){
            alert('You need to choose a book')
            return;
        }
        setSetting(true)
        
        var resposne
        try{
            if(!isConnected) {
                var index = false
                for (const prop in offline.user_book_profiles){
                    if(prop === book.id){
                        index = true;
                        break;
                    }
                }
                if(!index){
                    alert("can't set this book in offline")
                    return;
                }
            }
            await set_book_of_week(club_id,book.id,token,!isConnected,setOffline)
        }catch(err){
           
            setSetting(false)
        }
        setSetting(false)
    }

    return (<View>
            <Text style={styles.removeMembers}>Book of the Week</Text>
            <SearchBar 
            placeholder="Search here"
            onPress={()=>{console.log("onPress")}}
            onChangeText={(text) => {setSearch(text)}}
            onSearchPress={(text) => console.log('searching: ', text)}/>
            { (offline.user_club_profiles[club_id].book_of_the_week || book) ? <Image source={{uri: book ? book.cover : offline.user_club_profiles[club_id].book_of_the_week.cover}} style={styles.bowImage}/> : <Text style={styles.noBook}>No book of the week</Text>}
            {searchResult.length > 0 ? <FlatList
                style={{marginVertical:20}}
                horizontal
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                data={searchResult}
                extraData={book}
                renderItem={({item})=>{
                    const style = book.id == item.id ? {borderColor:'red'} : {}
                    return ( 
                    <BookCover 
                    size={80} 
                    source={item.cover} 
                    onPress={()=>{onSelect(item)}} 
                    style={[{marginHorizontal:10, borderWidth:2},style]}/>) }}
                keyExtractor={(item)=>item.id}
            /> : <Text style={[{color:'black'},styles.nobookesearch]}>No books found</Text> }
            <Button title='Save book of the week' onPress={setting? ()=>{} : onSubmit} style = {{backgroundColor: "#5e8d5a", paddingVertical: 15}} visible={setting}/>
            </View>)
}


export default BookSettings