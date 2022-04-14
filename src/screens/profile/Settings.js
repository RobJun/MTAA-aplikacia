import React, {useState, useContext,useCallback,useEffect} from "react"
import {View,Text,StyleSheet, ScrollView, FlatList, formImage, form} from 'react-native'
import ButtonSettings from "./button"
import ProfileImage from "../../components/profileImage"
import { globContext } from "../../context/globContext";
import DocumentPicker, { types } from 'react-native-document-picker';
import CredentialInput from "../../components/textInput";
import { API_SERVER } from "../../api_calls/constants";
import { compressImage } from "../../utils/imageCompression";

const Settings = ({navigation}) => {
    const {auth:{user:{token, user_id}},user,setUser} = useContext(globContext)
    const [formImage,setFormImage] = useState(false)
    const [form, setForm] = useState({})
    const [errors,setErrors] = useState({})
    const [countBio,setCountBio] = useState(0)
    const REQUIRED = "This field is required"
    
    const onChange = ({name,value}) => {
        console.log(value)
        if(name === 'displayName') {
            if (value?.length > 20) {
                setErrors({...errors, [name] : "max 20 characters"})
                return;
            }else {
                setErrors({...errors, [name] : null})
            }
        }
        if(name === "bio"){
           if (value?.length > 80) {
                setErrors({...errors, [name] : "max 80 characters"})
                return;
            }else{
                setErrors({...errors, [name] : null})
            }
        }
        if(name ==='bio' && value){
            setCountBio(value.length)
        }

        setForm(prev => {return {...prev, [name] : value}});

        if(name === 'displayName') {
            if (value?.length > 20) {
                setErrors({...errors, [name] : "max 20 characters"})
                return
            }
            if( value !== '') {
                setErrors({...errors, [name] : null})
            } else {
                setErrors({...errors, [name] : REQUIRED})
            }
        }
    }

    useEffect(()=>{
        onChange({ name: 'displayName' ,  value: user.displayName })
        onChange({name: 'bio', value: user.bio})
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

    const saveChanges = async () => {
            if(!form.displayName){
                setErrors((prev)=>{
                    return {...prev, name : REQUIRED}
                })
                return;
            }
            console.log(form.displayName)
            if(!form.displayName.match(/^[a-zA-Z0-9!@#$%^&*]\w{1,20}$/)) {
                setErrors((prev)=>{
                    return {...prev, displayName : 'Name contains illegal characters (legal: a-zA-Z0-9!@#$%^&*)'}
                })
                return;
            }else {
                setErrors((prev)=>{
                    return {...prev, displayName : null}
                })
            }
    
            const formb = new FormData();
            for (const [key, value] of Object.entries(form)) {
                if(value !== user[key]){
                    if(value === undefined)
                        formb.append(key,'')
                    else formb.append(key,value)
                }
            }   
            if(formImage)
                formb.append("photo", await compressImage(formImage));
            if(formb['_parts'].length === 0) return
            const response = await fetch(`http://${API_SERVER}/user/modify/`,{
                "method": "PUT",
                "headers" : {
                    "Content-Type": "multipart/form-data; boundary=---011000010111000001101001",
                    "Authorization" : `Token ${token}`
                },
                body: formb
            })
    
            if (response.status === 401 || response.status === 404){
                if(response.status === 401) alert('Neatorizovaný používateľ')
                else if(response.status === 404) alert('Prázdne pole DisplayName alebo fotka nie je podporovaný obrázok')
                return;
            }

            const body = await response.json()
            body.photoPath = body.photoPath +`?time=${new Date().getTime()}`
            setUser(body)
            navigation.goBack()
    }
    
        return (
            <ScrollView>
                <Text style = {styles.title}>Profile Settings</Text>
                <View style = {{marginLeft: 20, marginRight: 20, alignItems: "center"}}>
                    <ProfileImage style = {styles.club} source={formImage ? formImage.uri : user.photoPath} size={180} local={true}/>
                    <ButtonSettings onPress={imagePicker} title='Change profile picture'></ButtonSettings>
                    {formImage && <ButtonSettings onPress={()=>setFormImage(false)} title='Reset profile picture'/>}
                </View>
                <View style = {{marginLeft: 20, marginRight: 20}}>
                    <CredentialInput label={'Display name'} multi = {false} placeholder = {"Enter display name, max 20 characters"} value={form.displayName} onChangeText={(value)=>{onChange({name:'displayName',value})}} error={errors.displayName}/>
                    <CredentialInput label={'Bio'} multi = {true} height = {200} placeholder = {"Enter bio, max 100 characters"} value={form.bio} onChangeText={(value)=>{onChange({name:'bio',value})}} error={errors.bio}/>
                    <Text style = {{textAlign: "right" ,color: "black", marginRight: 30, marginBottom: 10}}>{countBio}/80</Text>
                </View>
                <ButtonSettings onPress={()=>{saveChanges()}} title='Save changes'></ButtonSettings>
            </ScrollView>
        )
    }

const styles = StyleSheet.create({
    image: {
        overflow: "hidden",
        marginLeft: 10,
        marginBottom: 5,
    },
    title : {
        fontSize: 20,
        fontFamily:'serif',
        color: "black",
        margin: 20,
        fontWeight: 'bold',
    },
})

export default Settings