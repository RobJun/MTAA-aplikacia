import React, { useEffect, useState, useContext,useCallback } from "react"
import {View, Image, Text, StyleSheet, ScrollView,Animated, RefreshControl} from 'react-native'
import { API_SERVER } from "../../api_calls/constants";
import { globContext } from "../../context/globContext";
import DropDownPicker  from 'react-native-dropdown-picker'
import RecommendedButton from "./RecommendedButton";
import { fetchBooks } from "../../api_calls/user_calls";
import {LoadingBookCover, LoadingText} from '../../components/onLoading'
import { useIsConnected } from "react-native-offline";
import OfflineScreen from "../offlineScreen";
import { ADD_BOOK } from "../../context/constants/offline";

const BookProfile = ({route}) => {
    const {auth:{user:{token,user_id}},user,library, setUser,setLibrary,setAuth,offline,setOffline} = useContext(globContext)
    const bookID = route.params.bookID
    const [textRecommendButton, setTextRecommendButton] = useState("Recommend")
    const [refreshing, setRefreshing] = useState(false);
    var isConnected = useIsConnected()
    const [loading,setLoading] = useState(true)
    const [info, setInfo] = useState({
        genre: {color: 0x808080ff},
        author:[{name: "Text",},],
        description: "text"})

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
      {label: 'Wishlist', value: 'wishlist'},
      {label: 'Reading', value: 'reading'},
      {label: 'Completed', value:'completed'},
    ]);

    
    const fetchInfo = async () => {
        try { 
            var data = null
            if(isConnected){
                const response = await fetch(`http://${API_SERVER}/find/info/${bookID}/`)
                if(response.status === 404) {
                    alert("Error 404 - Book not found")
                    return
                }
                data = await response.json()
                console.log('what')
                setOffline({type: ADD_BOOK,payload: data})
            }else {
               
                data = offline.user_book_profiles[bookID]
            }
            setInfo(data)
            if(data == undefined) return;
            if(offline.userData.recommended_books.find(x=> x.id === data.id) !== undefined) setTextRecommendButton('Recommended')
            if(offline.wishlist.find(x=> x.id === data.id) !== undefined) {
                setValue('wishlist')
                setItems(prev=> [...prev, {label: 'Remove', value:'remove'}])
            }
            else if (offline.reading.find(x=> x.id === data.id) !== undefined) {
                setValue('reading')
                setItems(prev=> [...prev, {label: 'Remove', value:'remove'}])
            }
            else if (offline.completed.find(x=> x.id === data.id) !== undefined) {
                setValue("completed")
                setItems(prev=> [...prev, {label: 'Remove', value:'remove'}])
            }
            setLoading(false)
        } catch (err) {
            alert(`${err} -- no internet connection`)
        } 

        //setLoading(false)
    }
    
    const onRefresh = useCallback(()=>{
        setRefreshing(true)
        fetchInfo()
        setRefreshing(false)
    },[])
    
    
    const putToLibrary = async (where) => {
        try { 
            const response = await fetch(`http://${API_SERVER}/user/book/${bookID}/?q=${where}`, {
                "method": "PUT",
                "headers" : { "Authorization" : "Token " + token }
            })
            if (response.status === 401 || response.status === 404 || response.status === 406) {
                if(response.status === 401) throw 'Error 401 - Neutorizovaný používateľ'
                else if(response.status === 404) alert('Error 404 - Neexistujúca kniha')
                else if(response.status === 406) alert('Error 406 - Neplatný príkaz - zlá kategória')
                return;
            }
            if(response.status == 409) return;

            const data = await response.json()
            setUser(data)
            fetchBooks(user_id,(books)=>{setLibrary((prev)=>{return {...prev , wishlist : books}})},"wishlist")
            fetchBooks(user_id,(books)=>{setLibrary((prev)=>{return {...prev , reading : books}})},"reading")
            fetchBooks(user_id,(books)=>{setLibrary((prev)=>{return {...prev , completed : books}})},"completed")
        } catch (err) {
            alert(`${err}\n\nLogging out`)
            setAuth({type:"LOGOUT"})
        } 
    }

    const deleteFromLibrary = async () => {
        try { 
            const response = await fetch(`http://${API_SERVER}/user/book/${bookID}/`,{
                "method": "DELETE",
                "headers" : { "Authorization" : "Token " + token }
            })
            if (response.status === 401 || response.status === 404) {
                if(response.status === 401)  throw ('Error 401 - Neutorizovaný používateľ')
                else if(response.status === 404) alert('Error 404 - Neexistujúca kniha')
            }
            if(response.status == 409) return;

            const data = await response.json()
            setUser(data)
            fetchBooks(user_id,(books)=>{setLibrary((prev)=>{return {...prev , wishlist : books}})},"wishlist")
            fetchBooks(user_id,(books)=>{setLibrary((prev)=>{return {...prev , reading : books}})},"reading")
            fetchBooks(user_id,(books)=>{setLibrary((prev)=>{return {...prev , completed : books}})},"completed")
        } catch (err) {
            alert(`${err}\n\nLogging out`)
            setAuth({type:"LOGOUT"})
        } 
    }

    const putToRecommended = async () => {
        if (textRecommendButton === "Recommended") {
            try { 
                const response = await fetch(`http://${API_SERVER}/user/book/${bookID}/?q=unrecommend`,{
                                "method": "PUT",
                                "headers" : { "Authorization" : "Token " + token}
                })
                if (response.status === 401 || response.status === 404 || response.status === 406) {
                    if(response.status === 401) throw('401 Neutorizovaný používateľ')
                    else if(response.status === 404) alert('Error 404 - Neexistujúca kniha')
                    else if(response.status === 406) alert('Erro 406 - Neplatný príkaz - zlá kategória')
                    return;
                }
                if(response.status == 409) return;

                const data = await response.json()
                setUser(data)
                setTextRecommendButton("Recommend")
            } catch (err) {
                    alert(`${err}\n\nLogging out`)
                    setAuth({type:"LOGOUT"})
            } 
        } else {
            try { 
            const response = await fetch(`http://${API_SERVER}/user/book/${bookID}/?q=recommend`,{
                            "method": "PUT",
                            "headers" : { "Authorization" : "Token " + token}
            })
            if (response.status === 401 || response.status === 404 || response.status === 406) {
                if(response.status === 401) throw('Error 401 - Neutorizovaný používateľ')
                else if(response.status === 404) alert('Erro 404 - Neexistujúca kniha')
                else if(response.status === 406) alert('Error 406 - Neplatný príkaz - zlá kategória')
                return;
            }
            if(response.status == 409) return;

            const data = await response.json()
            setUser(data)
            setTextRecommendButton("Recommended")
            }catch (err) {
                alert(`${err}\n\nLogging out`)
                setAuth({type:"LOGOUT"})
            } 
        }
    }

    useEffect(()=>{
         fetchInfo()
    },[isConnected])

    
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
    if(offline.user_book_profiles[bookID] === undefined && isConnected === false ) {
        return (<OfflineScreen/>)
    }
    return (
        <ScrollView showsVerticalScrollIndicator={false} refreshControl = {<RefreshControl  refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={{backgroundColor: `rgb(${((info.genre.color & 0xff000000)>>24)& 0xff},${(info.genre.color & 0x00ff0000)>>16},${(info.genre.color & 0x0000ff00)>>8})`, alignItems:"center"}}>
                {loading ? (<View style={{alignItems:"center"}}>
                                <LoadingBookCover style={styles.image} size={220} position={position}/>
                                <LoadingText position={position} height={40} width={150} containerStyle={{marginBottom: 20}}/>
                            </View>) :
                            (<View style={{alignItems:"center"}}>
                                <Image source={{uri:info.cover}} style={styles.image}/>
                                <Text style = {styles.title}> {info.author[0].name} : {info.title}</Text>
                            </View>) }
                <View style={{flexDirection:'row'}}>
                    <View style = {styles.border}>
                        <Text style={[styles.info, {marginTop: 10, fontWeight: "500"}]}>Rating</Text>
                        {loading ? <LoadingText style={{margin:20, flex: 0, alignSelf:'center'}} width={'50%'} height={20} position={position}/>:<Text style = {[styles.info, ]}>{info.rating}</Text>}
                    </View>
                    <View style = {styles.border}>
                        <Text style={[styles.info, {marginTop: 10, fontWeight: "500"}]}>Genre</Text>
                        {loading ? <LoadingText style={{flex: 0, alignSelf:'center'}} width={'50%'} height={20} position={position}/>:<Text style = {[styles.info,]}>{info.genre.name}</Text> }
                    </View>
                    <View style = {styles.border}>
                        <Text style={[styles.info, {marginTop: 10, fontWeight: "500"}]}>Pages</Text>
                        {loading ? <LoadingText style={{flex: 0, alignSelf:'center'}} width={'50%'} height={20} position={position}/>:<Text style = {[styles.info, ]}>{info.pages}</Text> }
                    </View>
                </View>
            </View>
            {loading ? ( <View style={{flexDirection:'row',  flex: 1, alignItems:"center", justifyContent: "space-evenly", marginLeft: 5, marginRight: 5, marginTop:20}}>
                    <LoadingText height={60}  containerStyle={{width:'40%'}} position={position}/>
                    <LoadingText height={60}  containerStyle={{width:'40%'}} position={position}/>
                        </View>): (
                <View style={{flexDirection:'row',  flex: 1, alignItems:"center", justifyContent: "space-evenly", marginLeft: 5, marginRight: 5, marginTop:20}}>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    containerStyle={{width:'40%'}}
                    placeholderStyle={{fontSize: 17}}
                    placeholder={'Add to Library'}
                    listParentLabelStyle={{fontSize: 17}}
                    dropDownContainerStyle={{backgroundColor: 'white',zIndex: 1000, elevation: 1000}}
                    onChangeValue={(item)=>{
                       
                        if(item === null || item ==='remove'){
                            setValue(null)
                           
                            if(item === 'remove') {
                                setItems(prev=> {prev.pop(); return prev})
                                deleteFromLibrary()
                            }
                        } else {
                            putToLibrary(item)
                           
                            if(items.length <4)
                                setItems(prev=>{return [...prev,{label: 'Remove', value:'remove'}]})
                           
                        }}}
                    />
                <RecommendedButton onPress={putToRecommended} title= {textRecommendButton} color = {`rgb(${((info.genre.color & 0xff000000)>>24)& 0xff},${(info.genre.color & 0x00ff0000)>>16},${(info.genre.color & 0x0000ff00)>>8})`}/> 
                </View>)}
            <View >
                <Text style = {{fontSize: 20, fontWeight: "bold", marginTop: 10, marginLeft: 10, marginRight: 20, marginLeft: 20, color: "black"}}>About</Text>
                {loading ? <LoadingText lines={7} style={styles.text} position={position} containerStyle={{marginTop:10,marginBottom:30}} randomlength={true}/> : <Text style = {styles.text}>{info.description}</Text> } 
            </View>
        </ScrollView>
    )
 }

const styles = StyleSheet.create({
    border: {
        borderBottomWidth: 2,
        borderColor: "white",
        borderTopWidth: 2,
        marginBottom: 30,
        marginLeft: 10,
        marginRight: 10,
        paddingBottom:10
    },
    info: {
        fontSize: 20,
        color: "black",
        marginLeft: 20,
        marginRight: 20,
        textAlign: "center",
    },
    image: {
        width:  190, 
        height: 300, 
        margin: 20, 
        resizeMode: 'contain',
        backgroundColor:'grey'
    },
    text : {
        display:'flex',
        flexDirection:'row',
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        letterSpacing: 1,
        lineHeight: 25,
        margin: 10,
        marginBottom: 30,
        marginRight: 20, 
        marginLeft: 20
    },
    title: {
        display:'flex',
        flexDirection:'row',
        fontSize: 22,
        fontFamily:'serif',
        color: "black",
        fontWeight: 'bold',
        textAlign: "center",
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 20,
    },
    button: {
        alignItems: 'center',
        margin: 10,
        paddingVertical: 12,
        borderRadius:10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 1, 
    },
})

export default BookProfile