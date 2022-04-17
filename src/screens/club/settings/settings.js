import React,{useContext,useState,useEffect,useCallback} from "react";
import {View,Text,FlatList,Image, StyleSheet,ScrollView,Alert, ActivityIndicator} from 'react-native'
import { clubContext } from "../index";
import Button from "../../../components/button";
import { globContext } from "../../../context/globContext";
import BasicSettings from "../../../forms/ClubBasicSettings";
import { fetchGroups,fetchInfo } from "../../../api_calls/user_calls";
import { compressImage, pickImage } from "../../../utils/imageCompression";
import { deleteGroup, getClubInfo, removeMember, saveChanges } from "../../../api_calls/club_calls";
import { CHARSET_ERROR, MAX, onlySpaces, REQUIRED, SPACES } from "../../../utils/validation";
import { styles } from "./style";
import BookSettings from "./bookSettings";
import MemberSettings from "./memberSettings";

const ClubSettingScreen = ({navigation}) => {
    const [formS,setFormS] = useState({})
    const [errors,setErrors] = useState({ username : false});
    const {auth:{user:{token,user_id}},setUser,setGroups,setAuth} = useContext(globContext)
    const {info, setInfo} = useContext(clubContext)
    const [formImage,setFormImage] = useState(false)
    const [submiting,setSubmiting] = useState(false)
    const [deleting,setDeleting] = useState(false)


    const onChange = ({name,value}) => {
        if(name === 'name'){
            if (value?.length > 20) {
                setErrors({...errors, [name] : "max 20 characters"})
                return;
                }else{
                    setErrors({...errors, [name] : null})
                }
        }
        setFormS(prev => {return {...prev, [name] : value}});

        if(name === 'name'){
            if (value !== '') {
                setErrors({...errors, [name] : null})
            } else {
                setErrors({...errors, [name] : REQUIRED})
            }

        }
    }

    useEffect(()=>{
        onChange({name:'name',value:info.name})
        onChange({name:'info',value:info.info})
        onChange({name:'rules',value:info.rules})
    },[])



    const imagePicker = useCallback(async () =>{
        await pickImage(setFormImage)
    })
    
    const onDelete = async () => {
        setDeleting(true)
        let success
        try {
            success = await deleteGroup(info.id,token)
        }catch(err){
            alert('Error'- err)
            setAuth({type:"LOGOUT"})
            setDeleting(false)
            return
        }
        if(success){
        try {
        fetchGroups(user_id,setGroups)
        fetchInfo(user_id,setUser)
        }catch (err) {
            console.log(err)
        }
        console.log(navigation)
        navigation.getParent()?.goBack()
        }else{
            alert("couldn't delete club")
        }
        setDeleting(false)
    }

    const onSubmit = async () => {

        if(!formS.name){
            setErrors((prev)=>{
                return {...prev, name : REQUIRED}
            })
            return;
        }
        if(formS.name > 20) {
            setErrors((prev)=>{
                return {...prev, name : MAX(20)}
            })
            return;
        }
        if(onlySpaces(formS.name)) {
            setErrors((prev)=>{
                return {...prev, name : SPACES}
            })
            return;
        }else {
            setErrors((prev)=>{
                return {...prev, name : null}
            })
        }

        setSubmiting(true)
        
        const form = new FormData();
        for (const [key, value] of Object.entries(formS)) {
            if(value !== info[key]){
                form.append(key,value)
            }
        }   
        if(formImage)
            form.append("photo", await compressImage(formImage));
            //form.append("photo",formImage)
        if(form['_parts'].length === 0) return

        try{
            await saveChanges(info.id,form,token,setInfo,setSubmiting)
        }catch(err){
            alert('Error'- err)
            setSubmiting(false)
            if(err === '401 neautorizovany pouzivatel')
                setAuth({type:"LOGOUT"})
            return
        }

        try {
            fetchGroups(user_id,setGroups)
            fetchInfo(user_id,setUser)
            setSubmiting(false)
            alert("Changes made")
        }catch(err){
            alert('Error'- err)
            setSubmiting(false)
        }
    }

    return (<ScrollView>
    <View style = {{backgroundColor: "#ee6f68"}}>
        <Text style={styles.header}>Bookclub settings</Text>
    </View>
    <BasicSettings 
        formImage={formImage}
        selectImage={imagePicker} 
        defaultImage={info.photoPath}
        resetImage={()=>setFormImage(false)} 
        onChange={onChange}
        error={errors} 
        form={formS} 
        onPress={submiting ? ()=>{} : onSubmit} 
        title={'Save Changes'}
        visible={submiting}/>
    <BookSettings/>
    <MemberSettings/>
    <Button title='Delete BookClub' onPress={deleting ? ()=>{} : ()=>{
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
        }} style={styles.deleteButton} visible={deleting}/>
    </ScrollView>
    )
}


export default ClubSettingScreen;