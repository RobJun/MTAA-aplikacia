import React , {useState,useCallback,useContext,useEffect} from 'react'
import {View,ActivityIndicator} from 'react-native'
import { API_SERVER } from '../../api_calls/constants'
import DocumentPicker, { types } from 'react-native-document-picker';
import BasicSettings from '../../forms/ClubBasicSettings'
import { useNavigation } from '@react-navigation/native';
import { globContext } from '../../context/globContext';
import {fetchInfo, fetchGroups } from '../../api_calls/user_calls';
import { compressImage, pickImage } from '../../utils/imageCompression';
import { saveChanges } from '../../api_calls/club_calls';
import { MAX, onlySpaces, REQUIRED, SPACES } from '../../utils/validation';

const NewClubForm = ({navigation,route})=>{
    const [formImage,setFormImage] = useState(false)
    const [formS,setFormS] = useState({})
    const [errors,setErrors] = useState({})
    const {navigate} = useNavigation()
    const {auth:{user:{token,user_id}},groups,setGroups,user,setUser,setAuth} = useContext(globContext)
    const [submiting,setSubmiting] = useState(false)


    const onChange = ({name,value}) => {
        if(name === 'name'){
            if (value?.length > 20) {
                setErrors({...errors, [name] : MAX(20)})
                return;
                }else{
                    setErrors({...errors, [name] : null})
                }
        }
        setFormS(prev => {return {...prev, [name] : value}});

        if(name === 'name' && value !== '') {
            setErrors({...errors, [name] : null})
        } else {
            setErrors({...errors, [name] : REQUIRED})
        }

    }
    useEffect(()=>{
        if(route.params?.clubName){
            onChange({name:'name',value:route.params.clubName})
        }
    },[])

    const onSubmit = async () => {
        if(!formS.name){
            setErrors((prev)=>{
                return {...prev, name : REQUIRED}
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
            form.append(key,value)
        }   
        if(formImage){
            form.append('photo',await compressImage(formImage))
        }
        console.log(form)

        let id 
        const setClubID = (body)=> {
            id = body.id
        }

        let success = false
        try {
            success = await saveChanges(null,form,token,setClubID,setSubmiting,true)
        }catch(err){
            alert('Error'- err)
            setSubmiting(false)
            if (err == '401 neautorizovany pouzivatel')
                setAuth({type:"LOGOUT"})
        }

        if (!success) return;

        try {
        fetchGroups(user_id,setGroups)
        fetchInfo(user_id,setUser)
        } catch (err) {
            console.log(err)
            setSubmiting(false)
        }

        navigation.pop()
        navigate('ClubsNav', {screen:'Club', params:{screen: 'Club_screen', params:{clubID:id}}})
    }

    const imagePicker = useCallback(async () =>{
        await pickImage(setFormImage)
    })

    return (
        <View>
        <BasicSettings
         formImage={formImage}
         selectImage={imagePicker}
         defaultImage={`http://${API_SERVER}/data/default/group.png`}
         resetImage={()=>setFormImage(false)}
         onChange={onChange}
         error={errors}
         form={formS}
         onPress={submiting ? ()=>{} : onSubmit}
         title={'Create Bookclub'}
         scrollable={true}
         visible={submiting}
         />
         </View>
    )
}


export default NewClubForm;