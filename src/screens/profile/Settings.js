import React, {useState, useContext,useCallback,useEffect} from "react"
import {View,Text,StyleSheet, ScrollView, FlatList, formImage, form} from 'react-native'
import ButtonSettings from "./button"
import ProfileImage from "../../components/profileImage"
import { globContext } from "../../context/globContext";
import CredentialInput from "../../components/textInput";
import { API_SERVER } from "../../api_calls/constants";
import { compressImage, pickImage } from "../../utils/imageCompression";
import { CHARSET_ERROR, MAX, onlySpaces, REQUIRED, SPACES } from "../../utils/validation";
import Button from "../../components/button";
import { useNetInfo } from "@react-native-community/netinfo";
import { save_settings } from "../../context/actions/offline";

const Settings = ({navigation}) => {
    const {auth:{user:{token, user_id}},setUser, offline:{userData},setOffline} = useContext(globContext)
    const [formImage,setFormImage] = useState(false)
    const [form, setForm] = useState({})
    const [errors,setErrors] = useState({})
    const [countBio,setCountBio] = useState(0)
    const [submiting,setSubmiting] = useState(false)
    var user = userData
    const {isConnected} = useNetInfo()
    const onChange = ({name,value}) => {
       
        if(name === 'displayName') {
            if (value?.length > 20) {
                setErrors({...errors, [name] : MAX(20)})
                return;
            }else {
                setErrors({...errors, [name] : null})
            }
        }
        if(name === "bio"){
           if (value?.length > 80) {
                setErrors({...errors, [name] :  MAX(80)})
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
                setErrors({...errors, [name] : MAX(20)})
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
         await pickImage(setFormImage)
    })

    const saveChanges = async () => {
            if(!form.displayName){
                setErrors((prev)=>{
                    return {...prev, name : REQUIRED}
                })
                return;
            }
           
            if(onlySpaces(form.displayName)) {
                setErrors((prev)=>{
                    return {...prev, displayName : SPACES}
                })
                return;
            }else {
                setErrors((prev)=>{
                    return {...prev, displayName : null}
                })
            }
    
            setSubmiting(true)
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
            if(formb['_parts'].length === 0) {
                navigation.goBack()
                setSubmiting(false)
                return
            }

            try {
                await save_settings(formb,token,!isConnected,setOffline);
                navigation.goBack()
            }catch (err) {
                console.log(err)
            } 
                /*const response = await fetch(`http://${API_SERVER}/user/modify/`,{
                    "method": "PUT",
                    "headers" : {
                        "Content-Type": "multipart/form-data; boundary=---011000010111000001101001",
                        "Authorization" : `Token ${token}`
                    },
                    body: formb
                })
        
                if (response.status === 401 || response.status === 404){
                    if(response.status === 401) throw('Error 401 - Neatorizovaný používateľ')
                    else if(response.status === 404) alert('Error 404 - Prázdne pole DisplayName alebo fotka nie je podporovaný obrázok')
                    setSubmiting(false)
                    return;
                }
    
                const body = await response.json()
                body.photoPath = body.photoPath +`?time=${new Date().getTime()}`
                setUser(body)
                navigation.goBack()
            } catch (err) {
                if(err === 'Error 401 - Neatorizovaný používateľ') {
                    alert(`${err}\n\nLogging out`)
                    setAuth({type:"LOGOUT"})
                }else {
                    alert('Network Connection error')
                }
            }*/
            setSubmiting(false)
    }
    
        return (
            <ScrollView>
                <Text style = {styles.title}>Profile Settings</Text>
                <View style = {{marginLeft: 20, marginRight: 20, alignItems: "center"}}>
                    <ProfileImage style = {styles.club} source={formImage ? formImage.uri : user.photoPath} size={150} local={true}/>
                    <ButtonSettings onPress={imagePicker} title='Change profile picture'></ButtonSettings>
                    {formImage && <ButtonSettings onPress={()=>setFormImage(false)} title='Reset profile picture'/>}
                </View>
                <View style = {{marginLeft: 20, marginRight: 20}}>
                    <CredentialInput label={'Display name'} multi = {false} placeholder = {"Enter display name, max 20 characters"} value={form.displayName} onChangeText={(value)=>{onChange({name:'displayName',value})}} error={errors.displayName}/>
                    <CredentialInput label={'Bio'} multi = {true} height = {200} placeholder = {"Enter bio, max 100 characters"} value={form.bio} onChangeText={(value)=>{onChange({name:'bio',value})}} error={errors.bio}/>
                    <Text style = {{textAlign: "right" ,color: "black", marginRight: 30, marginBottom: 10}}>{countBio}/80</Text>
                </View>
                <Button onPress={submiting? ()=>{} : saveChanges} title='Save changes' style={styles.button} textStyle={styles.buttonText} visible={submiting}/>
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
    },    button: {
        backgroundColor: "#c6d7b9",
        alignItems:'center',
        marginHorizontal: 20,
        marginTop: 10,
        paddingVertical: 10,
        borderRadius:10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 40,
        marginBottom: 20
    },
    buttonText: {
        fontSize: 20,
        color: "#5e8d5a",
        fontWeight: "bold"
    }
})

export default Settings