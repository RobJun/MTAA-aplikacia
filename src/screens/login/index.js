import React, {useContext,useState} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { globContext } from '../../context/globContext'
import {login_call} from '../../api_calls/auth_calls'
import Login from './Login'
import { CHARSET_ERROR, consistsOfCharacters, MAX, REQUIRED } from '../../utils/validation';

const LoginValidator = () => {
    const [form,setForm] = useState({});
    const [errors,setErrors] = useState({ username : false});
    const auth = useContext(globContext)

    const onChange = ({name,value}) => {
        const val = (name === 'name' ? 20 : 32)
        console.log(name,val , value.length)
        if (value?.length > val) {
            setErrors({...errors, [name] : MAX(val)})
            console.log('')
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

    }

    //validacia zadanych dat
    const onSubmit = () => {
        console.log(form)
        let error = false
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

        if(!consistsOfCharacters(form.name)) {
            setErrors((prev)=>{
                return {...prev, name : CHARSET_ERROR}
            })
            error = true
        }

        if(!consistsOfCharacters(form.password)) {
            setErrors((prev)=>{
                return {...prev, password : CHARSET_ERROR}
            })
            error = true
        }

        if(error){
            return;
        }

        auth.setAuth({type: "LOADING"})
        console.log("re")
        login_call(form).then(response => {
            console.log("auth_login_screen_success")
            if(response.code == 401) {
                console.log("auth_login_screen_success -- unauthorized")
                auth.setAuth({type: "ERROR",payload:"zle meno alebo heslo"})
            }else {
                try {
                    EncryptedStorage.setItem( "user_info", JSON.stringify(form));
                    auth.setAuth({type: "LOGIN", payload : response.body})
                } catch (error) {
                    auth.setAuth({type: "ERROR",payload:"cant store token"})
                }
            }
        }).catch(err => {
            console.log("error")
            console.log(err)
            auth.setAuth({type: "ERROR",payload:"nedari sa pripojit na server"})
        });
    }


    return (
        <Login onSubmit={onSubmit} onChange={onChange} form={form} error={errors}/>
    )
}


export default LoginValidator