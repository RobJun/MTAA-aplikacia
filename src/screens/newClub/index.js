import React , {useState,useCallback,useContext} from 'react'
import { API_SERVER } from '../../api_calls/constants'
import DocumentPicker, { types } from 'react-native-document-picker';
import BasicSettings from '../../forms/ClubBasicSettings'
import { useNavigation } from '@react-navigation/native';
import { globContext } from '../../context/globContext';
import {fetchInfo, fetchGroups } from '../../api_calls/user_calls';
import { Image } from 'react-native-compressor';
import RNFetchBlob from 'rn-fetch-blob'
import getPath from '@flyerhq/react-native-android-uri-path'
import { compressImage } from '../../utils/imageCompression';

const NewClubForm = (props)=>{
    const [formImage,setFormImage] = useState(false)
    const [formS,setFormS] = useState({})
    const [errors,setErrors] = useState({})
    const REQUIRED = 'Required field'
    const {navigate} = useNavigation()
    const {auth:{user:{token,user_id}},groups,setGroups,user,setUser} = useContext(globContext)

    const onChange = ({name,value}) => {
        setFormS(prev => {return {...prev, [name] : value}});

        if(name === 'name' && value !== '') {
            setErrors({...errors, [name] : null})
        } else {
            setErrors({...errors, [name] : REQUIRED})
        }

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
            form.append(key,value)
        }   
        if(formImage){
            form.append('photo',await compressImage(formImage))
        }
        console.log(form)
        const response = await fetch(`http://${API_SERVER}/group/create/`,{
            "method": "POST",
            "headers" : {
                "Content-Type": "multipart/form-data; boundary=---011000010111000001101001",
                "Authorization" : `Token ${token}`
            },
            body: form
        })
        console.log(response.status)

        if(response.status === 409){
            alert("Name already in use")
            return;
        }
        if (response.status === 406){
            alert("Not right name")
            return;
        }
        const body = await response.json()

        fetchGroups(user_id,setGroups)
        fetchInfo(user_id,setUser)
        
        navigate('ClubsNav', {screen:'Club', params:{screen: 'Club_screen', params:{clubID:body.id}}})
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
        <BasicSettings
         formImage={formImage}
         selectImage={imagePicker}
         defaultImage={`http://${API_SERVER}/data/default/group.png`}
         resetImage={()=>setFormImage(false)}
         onChange={onChange}
         error={errors}
         form={formS}
         onPress={onSubmit}
         title={'Create Bookclub'}
         scrollable={true}
         />
    )
}


export default NewClubForm;