import React,{useContext,useState,useEffect,useCallback} from "react";
import {View,Text,FlatList,Image, StyleSheet,ScrollView,Alert} from 'react-native'
import { clubContext } from ".";
import { API_SERVER } from "../../api_calls/constants";
import Button from "../../components/button";
import { globContext } from "../../context/globContext";
import DocumentPicker, { types } from 'react-native-document-picker';
import CredentialInput from "../../components/textInput";
import UserList from "./Userlist";
import ProfileImage from "../../components/profileImage";


const BasicSettings = ({formImage,selectImage,resetImage, onChange,error,form}) =>{
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
        </View>
    )
}

const Clubsettings = ({}) => {
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
    <BasicSettings formImage={formImage} selectImage={imagePicker} resetImage={()=>setFormImage(false)} onChange={onChange} error={errors} form={formS}/>
    <Button title='Save Chanages' onPress={onSubmit}></Button>
    <Clubsettings/>
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

    }
    
})


export default ClubSettingScreen;