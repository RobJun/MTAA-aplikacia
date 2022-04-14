import React, {useContext,useState} from 'react';
import {Text,View,TouchableOpacity} from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage';
import { globContext } from '../../context/globContext'
import {register_call} from '../../api_calls/auth_calls'
import Register from './Register';
import SelectDropdown from 'react-native-select-dropdown';
import { API_SERVER } from '../../api_calls/constants';

const RegisterValidator = ({navigation}) => {
    const [form,setForm] = useState({});
    const [errors,setErrors] = useState({ username : false});
    const REQUIRED = 'Required field'
    const auth = useContext(globContext)

    const onChange = ({name,value}) => {
        if(name === 'name') {
            if (value?.length > 20) {
                setErrors({...errors, [name] : "max 20 characters"})
                return;
            }else {
                setErrors({...errors, [name] : null})
            }
        }
        setForm({...form, [name] : value});

        if(value !== '') {
            setErrors({...errors, [name] : null})
        } else {
            setErrors({...errors, [name] : REQUIRED})
        }

        if(name === 'name') {
            if(value.length < 5) {
                setErrors({...errors,[name]:'name must be atleast 5 characters long'})
            }
        }

        if(name.includes('password')){
            if(value.length < 8){
                setErrors({...errors,[name]:'password must be atleast 8 characters long'})
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

        if(form.name.length < 5 || form.password.length < 8) {return;}

        if(!form.name.match(/^[a-zA-Z0-9!@#$%^&]*$/)){
            setErrors((prev)=>{
                return {...prev, name : 'name contain illegal characters (legal: a-z A-Z 0-9 !@#$%^&* )'}
            })
            error = true
        }
        else {
            setErrors((prev)=>{
                return {...prev, name : null}
            })
        }

        if(!form.password.match(/^[a-zA-Z0-9!@#$%^&*]*$/)){
            setErrors((prev)=>{
                return {...prev, password : 'password contain illegal characters (legal: a-z A-Z 0-9 !@#$%^&* )'}
            })
            error = true
        }

        if(error){
            return;
        }


        if (form.password === form.repassword){
            
            if(form.name && form.password){
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
        }else{
            
            if(form.name && form.password && form.repassword && form.password.length >=8 && form.repassword.length >=8)
                auth.setAuth({type:"ERROR", payload:"passwords don't match"})
        }
    }

    return (
        <Register onSubmit={onSubmit} onChange={onChange} form={form} error={errors} navigation={navigation}/>
    )
}


export default RegisterValidator