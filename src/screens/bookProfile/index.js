import React, { useEffect, useState, useContext } from "react"
import {View, Image, Text, StyleSheet, ScrollView} from 'react-native'
import { API_SERVER } from "../../api_calls/constants";
import { globContext } from "../../context/globContext";
import DropDownPicker  from 'react-native-dropdown-picker'
import RecommendedButton from "./RecommendedButton";
import { fetchBooks } from "../../api_calls/user_calls";


const BookProfile = ({route}) => {
    const {auth:{user:{token,user_id}},user,library, setUser,setLibrary} = useContext(globContext)
    const bookID = route.params.bookID
    const [textRecommendButton, setTextRecommendButton] = useState("Recommend")
    const [info, setInfo] = useState({
        genre: {color: 0xffffff00},
        author:[{name: "Text",},],
        description: "text"})

    const fetchInfo = async () => {
        const response = await fetch(`http://${API_SERVER}/find/info/${bookID}/`)
        if(response.status === 404) {
            alert("404 Book not found")
            return
        }
        const data = await response.json()
        setInfo(data)
        if(user.recommended_books.find(x=> x.id === data.id) !== undefined) setTextRecommendButton('Recommended')
        if(library.wishlist.find(x=> x.id === data.id) !== undefined) setValue('wishlist')
        else if (library.reading.find(x=> x.id === data.id) !== undefined) setValue('reading')
        else if (library.completed.find(x=> x.id === data.id) !== undefined) setValue("completed")
    }

    useEffect(() => {
        fetchInfo()
    }, [])
    
    
    const putToLibrary = async (where) => {
        const response = await fetch(`http://${API_SERVER}/user/book/${bookID}/?q=${where}`, {
            "method": "PUT",
            "headers" : { "Authorization" : "Token " + token }
        })
        if (response.status === 401 || response.status === 404 || response.status === 406) {
            if(response.status === 401) alert('401 Neutorizovaný používateľ')
            else if(response.status === 404) alert('404 Neexistujúca kniha')
            else if(response.status === 406) alert('406 Neplatný príkaz - zlá kategória')
            return;
        }
        if(response.status == 409) return;

        const data = await response.json()
        setUser(data)
        fetchBooks(user_id,(books)=>{setLibrary((prev)=>{return {...prev , wishlist : books}})},"wishlist")
        fetchBooks(user_id,(books)=>{setLibrary((prev)=>{return {...prev , reading : books}})},"reading")
        fetchBooks(user_id,(books)=>{setLibrary((prev)=>{return {...prev , completed : books}})},"completed")
    }

    const deleteFromLibrary = async (where) => {
        const response = await fetch(`http://${API_SERVER}/user/book/${bookID}/`,{
            "method": "DELETE",
            "headers" : { "Authorization" : "Token " + token }
        })
        if (response.status === 401 || response.status === 404) {
            if(response.status === 401) alert('401 Neutorizovaný používateľ')
            else if(response.status === 404) alert('404 Neexistujúca kniha')
        }
        if(response.status == 409) return;

        const data = await response.json()
        setUser(data)
        fetchBooks(user_id,(books)=>{setLibrary((prev)=>{return {...prev , wishlist : books}})},"wishlist")
        fetchBooks(user_id,(books)=>{setLibrary((prev)=>{return {...prev , reading : books}})},"reading")
        fetchBooks(user_id,(books)=>{setLibrary((prev)=>{return {...prev , completed : books}})},"completed")
    }

    const putToRecommended = async () => {
        if (textRecommendButton === "Recommended") {
            const response = await fetch(`http://${API_SERVER}/user/book/${bookID}/?q=unrecommend`,{
                            "method": "PUT",
                            "headers" : { "Authorization" : "Token " + token}
            })
            if (response.status === 401 || response.status === 404 || response.status === 406) {
                if(response.status === 401) alert('401 Neutorizovaný používateľ')
                else if(response.status === 404) alert('404 Neexistujúca kniha')
                else if(response.status === 406) alert('406 Neplatný príkaz - zlá kategória')
                return;
            }
            if(response.status == 409) return;

            const data = await response.json()
            setUser(data)
            setTextRecommendButton("Recommend")
        } else {
            const response = await fetch(`http://${API_SERVER}/user/book/${bookID}/?q=recommend`,{
                            "method": "PUT",
                            "headers" : { "Authorization" : "Token " + token}
            })
            if (response.status === 401 || response.status === 404 || response.status === 406) {
                if(response.status === 401) alert('401 Neutorizovaný používateľ')
                else if(response.status === 404) alert('404 Neexistujúca kniha')
                else if(response.status === 406) alert('406 Neplatný príkaz - zlá kategória')
                return;
            }
            if(response.status == 409) return;

            const data = await response.json()
            setUser(data)
            setTextRecommendButton("Recommended")
        }
    }


    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
      {label: 'Wishlist', value: 'wishlist'},
      {label: 'Reading', value: 'reading'},
      {label: 'Completed', value:'completed'},
      {label: 'Remove', value:'remove', disabled: true}
    ]);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{backgroundColor: `rgb(${((info.genre.color & 0xff000000)>>24)& 0xff},${(info.genre.color & 0x00ff0000)>>16},${(info.genre.color & 0x0000ff00)>>8})`, alignItems:"center"}}>
                <Image source={{uri:info.cover}} style={ styles.image}/>
                <Text style = {styles.title}> {info.author[0].name} : {info.title}</Text>
                <View style={{flexDirection:'row'}}>
                    <View style = {styles.border}>
                        <Text style={[styles.info, {marginTop: 10, fontWeight: "500"}]}>Rating</Text>
                        <Text style = {[styles.info, {marginBottom: 10}]}>{info.rating}</Text>
                    </View>
                    <View style = {styles.border}>
                        <Text style={[styles.info, {marginTop: 10, fontWeight: "500"}]}>Genre</Text>
                        <Text style = {[styles.info, {marginBottom: 10}]}>{info.genre.name}</Text>
                    </View>
                    <View style = {styles.border}>
                        <Text style={[styles.info, {marginTop: 10, fontWeight: "500"}]}>Pages</Text>
                        <Text style = {[styles.info, {marginBottom: 10}]}>{info.pages}</Text>
                    </View>
                </View>
            </View>
            <View style={{flexDirection:'row',  flex: 1, alignItems:"center", justifyContent: "space-evenly", marginLeft: 5, marginRight: 5}}>
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
                            setItems(prev=>{
                                const d = prev.pop()
                                prev.push({...d,disabled:true})
                                return prev })
                            if(item === 'remove') deleteFromLibrary()
                        } else {
                            putToLibrary(item)
                            
                            setItems(prev=>{
                                const d = prev.pop()
                                prev.push({...d,disabled:false})
                                return prev
                            })
                        }}}
                    />
                <RecommendedButton onPress={putToRecommended} title= {textRecommendButton} color = {`rgb(${((info.genre.color & 0xff000000)>>24)& 0xff},${(info.genre.color & 0x00ff0000)>>16},${(info.genre.color & 0x0000ff00)>>8})`}/> 
            </View>
            <View >
                <Text style = {{fontSize: 20, fontWeight: "bold", marginTop: 10, marginLeft: 10, marginRight: 20, marginLeft: 20, color: "black"}}>About</Text>
                <Text style = {styles.text}>{info.description}</Text>
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
        marginRight: 10
    },
    info: {
        fontSize: 20,
        color: "black",
        marginLeft: 20,
        marginRight: 20,
        textAlign: "center",
    },
    image: {
        width:  240, 
        height: 300, 
        margin: 20, 
        resizeMode: 'contain'
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
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: "center",
        marginLeft: 10,
        marginRight: 10
    },
})

export default BookProfile