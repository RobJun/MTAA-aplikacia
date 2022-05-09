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
import { useNetInfo } from "@react-native-community/netinfo";
import { delete_club, save_club_changes } from "../../../context/actions/offline";

const ClubSettingScreen = ({navigation,route}) => {
    const clubID = route.params.clubID
    const [formS,setFormS] = useState({})
    const [errors,setErrors] = useState({ username : false});
    const {auth:{user:{token,user_id}},setUser,setGroups,setAuth,offline,setOffline} = useContext(globContext)
    const {info, setInfo} = useContext(clubContext)
    const [formImage,setFormImage] = useState(false)
    const [submiting,setSubmiting] = useState(false)
    const [deleting,setDeleting] = useState(false)
    const {isConnected} = useNetInfo()


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
        onChange({name:'name',value:offline.user_club_profiles[clubID].name})
        onChange({name:'info',value:offline.user_club_profiles[clubID].info})
        onChange({name:'rules',value:offline.user_club_profiles[clubID].rules})
    },[])



    const imagePicker = useCallback(async () =>{
        await pickImage(setFormImage)
    })
    
    const onDelete = async () => {
        setDeleting(true)
        let success
        try {
            success = await delete_club(clubID,token,user_id,!isConnected,setOffline)
        }catch(err){
           
            if(err === 0xff){
                alert('Couldnt delete club',err)
                setDeleting(false)
            }
            return
        }
       
        navigation.getParent()?.goBack()
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
            if(value !== offline.user_club_profiles[clubID][key]){
                form.append(key,value)
            }
        }   
        if(formImage)
            form.append("photo", await compressImage(formImage));
            //form.append("photo",formImage)
        if(form['_parts'].length === 0) {
            setSubmiting(false)
           
            return
        }

        try{
            await save_club_changes(clubID,form,token,user_id,!isConnected,setOffline)
            setFormImage(false)
        }catch(err){
            alert('Error'- err)
            setSubmiting(false)
            if(err === '401 neautorizovany pouzivatel')
                setAuth({type:"LOGOUT"})
            return
        }
        setSubmiting(false)
    }

    return (<ScrollView>
    <View style = {{backgroundColor: "#ee6f68"}}>
        <Text style={styles.header}>Bookclub settings</Text>
    </View>
    <BasicSettings 
        editable={isConnected}
        formImage={formImage}
        selectImage={imagePicker} 
        defaultImage={offline.user_club_profiles[clubID].photoPath}
        resetImage={()=>setFormImage(false)} 
        onChange={onChange}
        error={errors} 
        form={formS} 
        onPress={submiting ? ()=>{} : onSubmit} 
        title={'Save Changes'}
        visible={submiting}/>
    <BookSettings club_id={clubID}/>
    <MemberSettings club_id={clubID}/>
    <Button title='Delete BookClub' onPress={deleting ? ()=>{} : ()=>{
        Alert.alert(`DELETE ${offline.user_club_profiles[clubID].name}`,`Are you sure about deleting ${offline.user_club_profiles[clubID].name}?`,
        [
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