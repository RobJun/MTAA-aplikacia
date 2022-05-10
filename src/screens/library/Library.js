import React, {useContext, useState, useCallback,useEffect} from "react"
import {View, Image, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,RefreshControl,Animated} from 'react-native'
import ButtonLibrary from "./button"
import { globContext } from "../../context/globContext";
import { useNavigation } from '@react-navigation/native';
import { fetchBooks } from "../../api_calls/user_calls";
import { VerticalBookList } from "../../components/onLoading";

const Library = () => {
    const {navigate} = useNavigation()
    const {auth:{user:{token,user_id}},library, setLibrary,loading,offline, offline:{wishlist, completed, reading}} = useContext(globContext)
    const [wishlistColor, setWishlistColor] = useState("grey")
    const [readingColor, setReadingColor] = useState("#f17c56") 
    const [completedColor, setCompletedColor] = useState("grey")  
    const [bgColor, setBColor] = useState("#f17c56") 
    const [which,setWhich] = useState('reading')
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(()=>{
        setRefreshing(true)
        fetchBooks(user_id,(books)=>{state.wishlist = books},"wishlist")
        fetchBooks(user_id,(books)=>{state.reading = books},"reading")
        fetchBooks(user_id,(books)=>{state.completed = books},"completed")
        setRefreshing(false)
    },[])
    
    const changeLibrary = (which, color1, color2, color3) => {
        setWhich(which)
        setWishlistColor(color1)
        setReadingColor(color2)
        setCompletedColor(color3)
        if (which === "wishlist") setBColor(color1)
        if (which === "reading") setBColor(color2)
        if (which === "completed") setBColor(color3)
    }

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
        <ScrollView refreshControl = {<RefreshControl  refreshing={refreshing} onRefresh={onRefresh} />}>
             <View style={{flexDirection:'row',  alignItems:"center", justifyContent: "space-evenly", marginLeft: 20, marginRight: 20}}>
                <ButtonLibrary onPress={()=>{changeLibrary("wishlist", "#ffc04a", "grey", "grey")}} title="Wishlist" color={wishlistColor}/>
                <ButtonLibrary onPress={()=>{changeLibrary("reading", "grey", "#f17c56", "grey")}} title="Reading" color ={readingColor}/>
                <ButtonLibrary onPress={()=>{changeLibrary("completed", "grey", "grey", "#ee6f68")}} title="Completed" color ={completedColor}/>
            </View>
            <View style = {{marginBottom: 10, marginTop: 20}}>
                {loading ? <VerticalBookList position={position} bgcolor={bgColor}/> :
                offline[which].length == 0 ? <Text style = {[styles.text, {marginTop: 20}]}>You don't have any book in this category</Text> : 
                    <FlatList
                        scrollEnabled
                        data={offline[which]}
                        extraData={offline}
                        renderItem={({item})=>{
                            return ( 
                            <TouchableOpacity onPress={()=>{navigate('LibraryNav', {screen:'Book', params:{bookID:item.id}})}}>
                                <View style = {{flexDirection:'row', flex: 1}}>
                                    <View style = {{ width: "35%", marginLeft:10, marginBottom: 10}}>    
                                        <Image source={{uri:item.cover_path}} style={styles.image}/>
                                    </View>
                                    <View style = {{width: "58%", height: 210, marginRight: 20, marginBottom: 10, backgroundColor: bgColor, borderTopRightRadius: 20, borderBottomRightRadius: 20}}>
                                        <View style = {{height: "30%"}}><Text style={styles.title}>{item.title}</Text></View>
                                        <View style = {{height: "70%"}}><Text style={styles.text}>{item.description.substring(0,120)}...</Text></View>
                                    </View>
                                </View>
                            </TouchableOpacity>)
                        }}
                        keyExtractor={(item)=>item.id}
                        />}
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
        height: 210, 
        resizeMode: 'contain', 
        marginBottom: 5,
        borderWidth:5,
        backgroundColor:'grey'
    },
    title : {
        flexWrap: 'wrap', 
        fontSize: 18,
        fontFamily:'serif',
        color: "black",
        marginTop: 10,
        marginRight: 10,
        marginLeft: 15,
        fontWeight: 'bold',
    },
    text: {
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