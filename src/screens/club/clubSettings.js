import React,{useContext,useState,useEffect,useCallback} from "react";
import {View,Text,FlatList,Image, StyleSheet,ScrollView,Alert, TouchableOpacity} from 'react-native'
import { clubContext } from ".";
import { API_SERVER } from "../../api_calls/constants";
import Button from "../../components/button";
import { globContext } from "../../context/globContext";
import DocumentPicker, { types } from 'react-native-document-picker';
import CredentialInput from "../../components/textInput";
import UserList from "./Userlist";
import ProfileImage from "../../components/profileImage";
import SearchBar from "react-native-dynamic-search-bar";
import BookCover from "../../components/BookCover";



const BasicSettings = ({formImage,selectImage,resetImage, onChange,error,form,title,onPress}) =>{
    const {info, setInfo} = useContext(clubContext)
    console.log(formImage)
    console.log(form)
    return (
        <View>
            <View style={styles.clubHeader}>
                <ProfileImage source={formImage ? formImage.uri : info.photoPath} size={180} local={true}/>
                <Button onPress={selectImage} title='Change Image'></Button>
                {formImage && <Button onPress={resetImage} title='Reset Image'/>}
            </View>
            <CredentialInput label={'Name'} value={form.name} onChangeText={(value)=>{onChange({name:'name',value})}} error={error.name}/>
            <CredentialInput label={'About'} value={form.info} onChangeText={(value)=>{onChange({name:'info',value})}}/>
            <CredentialInput label={'Rules'} value={form.rules} onChangeText={(value)=>{onChange({name:'rules',value})}}/>
            <Button title={title} onPress={onPress}></Button>
        </View>
    )
}

const MemberSettings = ({}) => {
    const {info, setInfo} = useContext(clubContext)
    const {auth:{user:{token,user_id}}} = useContext(globContext)
    const [removeUserIDs,setRemoveUserIDs] = useState([])

    const removeMembers = async () => {
        var newInfo = undefined
        var refetchData = false
        for(let i = 0; i< removeUserIDs.length;i++){
            try{
            const response = await fetch(`http://${API_SERVER}/group/remove/${info.id}/?q=${removeUserIDs[i]}`,{
                "method" : "DELETE",
                "headers" : {
                "Authorization" : `Token ${token}`
                }
            })
            if(response.status === 409){
                console.log('e')
                refetchData=true
                continue;
            }
            if(response.status >= 400) continue;
            refetchData=false
            newInfo = await response.json()
            }catch(e){
                console.log(e)
            }
        }
        setRemoveUserIDs([])
        if(refetchData){
            console.log("refatchein")
            const response = await fetch(`http://${API_SERVER}/group/info/${info.id}/`)
            newInfo = await response.json()
        }
        if(newInfo !== undefined){
            newInfo.photoPath = newInfo.photoPath +`?time=${new Date().getTime()}`
            setInfo(newInfo)
        }
    }

    const onSelect = ({id,owner}) => {
        console.log(id)
        setRemoveUserIDs(prev=>{
            if(owner) return [...prev]
            if(prev.includes(id)){
                console.log(prev)
                const index = prev.indexOf(id)
                prev.splice(index,1)
                console.log(prev)
                return [...prev]
            }
            return [...prev,id]
        }
    )}

    return (<View style = {{marginHorizontal: 10}}>
                        <Text style={styles.removeMembers}>Remove Members</Text>
                        <UserList users={info.users} onSelect={onSelect} selectArray={removeUserIDs}/>
                        <Button title='Remove Members' onPress={removeMembers} style={styles.deleteButton}></Button>
            </View>)
}



const BookSetttings = ({})=> {
    const {info, setInfo} = useContext(clubContext)
    const {auth:{user:{token,user_id}}} = useContext(globContext)
    const [book,setBook] = useState(false)
    const [search,setSearch] = useState("")
    const [searchResult,setSearchResult] = useState([])
    const [searching,setSearching] = useState(false)

    const fetchBooks = async (query) => {
        setSearching(true)
        const response = await fetch(`http://${API_SERVER}/find/books/?q=${query}`)
        setSearchResult(await response.json())
        setSearching(false)
    }

    useEffect(()=>{
        if(search.length < 4 ){
            console.log('string must be atleast 4 characters')
            return;
        }
        if(searching){
            console.log('cant search, search on going')
        }
        fetchBooks(search)

    },[search])

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
            alert('treba vzbrat knihu')
            return;
        }
        const resposne = await fetch(`http://${API_SERVER}/group/book/${info.id}/?q=${book.id}`, {
            "method": "PUT",
            "headers": {
              "Authorization": `Token ${token}`
            }
        })
        if(resposne.status > 400){
            alert(`Bad request: ${resposne.status}`)
            return;
        }
        setInfo(await resposne.json())
        alert('Your book was set')

    }
    return (<View>
            <Text style={styles.removeMembers}>Book of the Week</Text>
            <SearchBar 
            placeholder="Search here"
            onPress={()=>{console.log("onPress")}}
            onChangeText={(text) => {setSearch(text)}}
            onSearchPress={(text) => console.log('searching: ', text)}/>
            { (info.book_of_the_week || book) ? <Image source={{uri: book ? book.cover : info.book_of_the_week.cover}} style={styles.bowImage}/> : <Text style={styles.noBook}>No book of the week</Text>}
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
            <Button title='save book of the week' onPress={onSubmit}/>
            </View>)
}

const ClubSettingScreen = ({navigation}) => {
    const [formS,setFormS] = useState({})
    const [errors,setErrors] = useState({ username : false});
    const {auth:{user:{token,user_id}}} = useContext(globContext)
    const {info, setInfo} = useContext(clubContext)
    const [formImage,setFormImage] = useState(false)
    const REQUIRED = 'Required field'


    const onChange = ({name,value}) => {
        setFormS(prev => {return {...prev, [name] : value}});

        if(name === 'name' && value !== '') {
            setErrors({...errors, [name] : null})
        } else {
            setErrors({...errors, [name] : REQUIRED})
        }

    }

    useEffect(()=>{
        onChange({name:'name',value:info.name})
        onChange({name:'info',value:info.info})
        onChange({name:'rules',value:info.rules})
    },[])



    const imagePicker = useCallback(async () =>{
        try {
            const response = await DocumentPicker.pick({
              presentationStyle: 'fullScreen',
              type: [types.images],
              allowMultiSelection:false
            });
            console.log(response[0].uri)
            setFormImage(response[0]);
          } catch (err) {
            console.warn(err);
          }
    })
    
    const onDelete = async () => {
        const response = await fetch(`http://${API_SERVER}/group/delete/${info.id}/`, {
            "method": "DELETE",
            "headers": {
              "Authorization": `Token ${token}`
            }
          }
          )
        if(response.status > 400) {
            alert("couldn't delete club")
            return
        }
        console.log(navigation)
        navigation.getParent()?.goBack()
    }

    const onSubmit = async () => {

        if(!formS.name){
            setErrors((prev)=>{
                return {...prev, name : REQUIRED}
            })
            return;
        }


        const form = new FormData();
        
        for (const [key, value] of Object.entries(formS)) {
            if(value !== info[key]){
                form.append(key,value)
            }
        }   
        if(formImage)
            form.append("photo", formImage);
        console.log('here')
        const response = await fetch(`http://${API_SERVER}/group/modify/${info.id}/`,{
            "method": "PUT",
            "headers" : {
                "Content-Type": "multipart/form-data; boundary=---011000010111000001101001",
                "Authorization" : `Token ${token}`
            },
            body: form
        })

        if(response.status === 409){
            alert("Name already in use")
            return;
        }
        if (response.status === 406){
            alert("Not right name")
            return;
        }
        const body = await response.json()
        console.log(body)
        body.photoPath = body.photoPath +`?time=${new Date().getTime()}`
        setInfo(body)
        alert("Changes made")
    }

    return (<ScrollView>
    <View>
        <Text style={styles.header}>Bookclub settings</Text>
    </View>
    <BasicSettings formImage={formImage} selectImage={imagePicker} resetImage={()=>setFormImage(false)} onChange={onChange} error={errors} form={formS} onPress={onSubmit} title={'Save Changes'}/>
    <BookSetttings/>
    <MemberSettings/>
    <Button title='Delete BookClub' onPress={()=>{
        Alert.alert(`DELETE ${info.name}`,`Are you sure about deleting ${info.name}?`,[
            {
                text: "Cancel",
                onPress: () => {},
                style: "cancel"
            },
            {
                text:"Yes",
                onPress: ()=>{
                    onDelete()
                }
            }
        ])
        }} style={styles.deleteButton}/>
    </ScrollView>
    )
}

const styles = StyleSheet.create({
    header : {
        marginLeft: 10,
        marginTop:20,
        fontSize:30,
        fontFamily:'serif',
        color: 'black',
        fontWeight: '600'
    },
    member : {
        width: 70,
        height: 70,
        borderRadius: 70 / 2,
        overflow: "hidden",
        marginLeft: 20,
        alignItems: "center"
    },
    name : {
        display:'flex',
        flexDirection:'row',
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        textAlign: "center",
        fontWeight: 'bold',
        marginLeft: 25,
        marginBottom: 20
    },clubHeaderImage : {
        width:180,
        height:180,
        borderRadius:180/2
    },
    clubHeader : {
        alignItems:'center',
        paddingTop:20,
        paddingBottom:20
    },
    deleteButton : {
        backgroundColor : 'red'
    },
    removeMembers : {
        color: 'black',
        fontFamily: 'serif',
        fontSize:20,
        fontWeight: '600',
        marginVertical:15

    },
    bowImage : {
        width:150,
        height:230,
        alignSelf:'center',
        marginVertical:20,
    },
    noBook : {
        alignSelf: 'center',
        marginVertical:115,
        fontSize: 20
    },
    nobookesearch : {
        alignSelf: 'center',
        marginVertical:50,
        fontSize: 20
    }
    
})


export default ClubSettingScreen;