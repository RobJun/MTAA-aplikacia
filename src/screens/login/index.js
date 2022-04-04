import React, {useContext,useState} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

import { globContext } from '../../context/globContext'
import login_call from '../../api_calls/login_call'
import Login from './Login'

const LoginValidator = () => {
    const [form,setForm] = useState({});
    const [errors,setErrors] = useState({ username : false});
    const REQUIRED = 'Required field'
    const auth = useContext(globContext)

    const onChange = ({name,value}) => {
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
        if(!form.name){
            setErrors((prev)=>{
                return {...prev, name : REQUIRED}
            })
        }
        if(!form.password){
            setErrors((prev)=>{
                return {...prev, password : REQUIRED}
            })
        }

        if(form.name && form.password){
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
    }


    return (
        <Login onSubmit={onSubmit} onChange={onChange} form={form} error={errors}/>
    )
}


export default LoginValidator