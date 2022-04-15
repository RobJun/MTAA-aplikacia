import React , {useState,useCallback,useContext,useEffect} from 'react'
import {View,ActivityIndicator} from 'react-native'
import { API_SERVER } from '../../api_calls/constants'
import DocumentPicker, { types } from 'react-native-document-picker';
import BasicSettings from '../../forms/ClubBasicSettings'
import { useNavigation } from '@react-navigation/native';
import { globContext } from '../../context/globContext';
import {fetchInfo, fetchGroups } from '../../api_calls/user_calls';
import { compressImage } from '../../utils/imageCompression';

const NewClubForm = ({navigation,route})=>{
    const [formImage,setFormImage] = useState(false)
    const [formS,setFormS] = useState({})
    const [errors,setErrors] = useState({})
    const REQUIRED = 'Required field'
    const {navigate} = useNavigation()
    const {auth:{user:{token,user_id}},groups,setGroups,user,setUser,setAuth} = useContext(globContext)
    const [submiting,setSubmiting] = useState(false)


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
        
        if(!formS.name.match(/^[a-zA-Z0-9!@#$%^&*]*$/)) {
            setErrors((prev)=>{
                return {...prev, name : 'Name contains illegal characters (legal: a-zA-Z0-9!@#$%^&*)'}
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
        try {
        const response = await fetch(`http://${API_SERVER}/group/create/`,{
            "method": "POST",
            "headers" : {
                "Content-Type": "multipart/form-data; boundary=---011000010111000001101001",
                "Authorization" : `Token ${token}`
            },
            body: form
        })
        console.log(response.status)

        if(response.status === 401) throw '401 neautorizovany pouzivatel'

        if(response.status === 409){
            alert("Name already in use")
            setSubmiting(false)
            return;
        }
        if (response.status === 406){
            alert("Not right name")
            setSubmiting(false)
            return;
        }
        const body = await response.json()

        fetchGroups(user_id,setGroups)
        fetchInfo(user_id,setUser)

        navigation.pop()
        navigate('ClubsNav', {screen:'Club', params:{screen: 'Club_screen', params:{clubID:body.id}}})
        }catch(err){
            alert('Error'- err)
            setAuth({type:"LOGOUT"})
        }
    }

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

    return (
        <View>
        {submiting && <ActivityIndicator visible={true} size='large'/>}
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
         />
         </View>
    )
}


export default NewClubForm;