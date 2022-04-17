import React, {useContext,useState} from 'react';
import {Text,View,TouchableOpacity} from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage';
import { globContext } from '../../context/globContext'
import {register_call} from '../../api_calls/auth_calls'
import Register from './Register';
import SelectDropdown from 'react-native-select-dropdown';
import { API_SERVER } from '../../api_calls/constants';
import { CHARSET_ERROR, consistsOfCharacters, MAX, MIN, REQUIRED } from '../../utils/validation';

const RegisterValidator = ({navigation}) => {
    const [form,setForm] = useState({});
    const [errors,setErrors] = useState({ username : false});
    const auth = useContext(globContext)

    const onChange = ({name,value}) => {
        const val = (name === 'name' ? 20 : 32)
            if (value?.length > val) {
                setErrors({...errors, [name] : MAX(val)})
                return;
            }else {
                setErrors({...errors, [name] : null})
            }

        setForm({...form, [name] : value});

        if(value !== '') {
            setErrors({...errors, [name] : null})
        } else {
            setErrors({...errors, [name] : REQUIRED})
        }

        if(name === 'name') {
            if(value.length < 5) {
                setErrors({...errors,[name]:MIN(5)})
            }
        }

        if(name.includes('password')){
            if(value.length < 8){
                setErrors({...errors,[name]:MIN(8)})
            }
        }

    }

    //validacia zadanych dat
    const onSubmit = () => {
        console.log(form)
        var error = false
        if(!form.name){
            setErrors((prev)=>{
                return {...prev, name : REQUIRED}
            })
            error = true
        }
        if(!form.password){
            setErrors((prev)=>{
                return {...prev, password : REQUIRED}
            })
            error = true
        }
        if(!form.repassword){
            setErrors((prev)=>{
                return {...prev, repassword : REQUIRED}
            })
            error = true
        }

        if(error) return;

        if(form.name.length < 5 || form.password.length < 8) {error = true;}

        if(!consistsOfCharacters(form.name)){
            setErrors((prev)=>{
                return {...prev, name : CHARSET_ERROR}
            })
            error = true
        }

        if(!consistsOfCharacters(form.password)){
            setErrors((prev)=>{
                return {...prev, password : CHARSET_ERROR}
            })
            error = true
        }
        if(!consistsOfCharacters(form.repassword)){
            setErrors((prev)=>{
                return {...prev, repassword : CHARSET_ERROR}
            })
            error = true
        }

        if(error){
            return;
        }


        if (form.password !== form.repassword){
            auth.setAuth({type:"ERROR", payload:"passwords don't match"})
            return
        }
        if(form.name && form.password )
        auth.setAuth({type: "LOADING"})
        register_call(form).then(response => {
        console.log("auth_login_screen_success")
        if(response.code == 406) {
            auth.setAuth({type: "ERROR",payload:"bad register request"})
        }
        else if(response.code == 409) {
            console.log("auth_login_screen_success -- unauthorized")
            auth.setAuth({type: "ERROR",payload:"username is used"})
        }else {
            try {
                EncryptedStorage.setItem( "user_info", JSON.stringify(form));
                auth.setAuth({type: "LOGIN", payload : {user_id : response.body.id, token : response.body.token}})
            } catch (error) {
                auth.setAuth({type: "ERROR",payload:"cant store token"})
            }
        }
        }).catch(err => {
        console.log("error")
        console.log(err)
        auth.setAuth({type: "ERROR",payload:"passwords don't match"})
        });
    }

    return (
        <Register onSubmit={onSubmit} onChange={onChange} form={form} error={errors} navigation={navigation}/>
    )
}


export default RegisterValidator