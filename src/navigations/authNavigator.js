import React, {useContext,useState} from 'react';
import {Text,View,ActivityIndicator,Alert,AsyncS} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import Button from '../components/button';
import { globContext } from '../context/globContext';
import CredentialInput from '../components/textInput';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';


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
            fetch("http://192.168.1.2:8000/auth/login/", {
                "method": "POST",
                "headers": {
                "Content-Type": "application/json"
                },
                "body": JSON.stringify(form),
                
            })
            .then(response => {
                console.log("response")
                if(response.status == 401) {
                    auth.setAuth({type: "ERROR",payload:"zle meno alebo heslo"})
                }else {

                    response.json().then((json) =>{
                    console.log(">>json")
                    console.log(json)
                    console.log("<<json")
                    try {
                        EncryptedStorage.setItem( "user_token", JSON.stringify(json));
                        auth.setAuth({type: "LOGIN", payload : json})
                    } catch (error) {
                        auth.setAuth({type: "ERROR",payload:"cant store token"})
                    }
                })
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


const Loading = () => {
    return
}


const Login = ({onSubmit,onChange,form,error}) => {
    const {navigate} = useNavigation();
    const {auth,setAuth} = useContext(globContext)
    if (auth.error) {
        console.log(auth)
        Alert.alert(auth.error, auth.error, [{text: "toto stlac",onPress: () => {setAuth({type: "CLEAR"})}}])
    }
    return (
        <View>
            <CredentialInput label={'Username'} onChangeText={(value) =>{onChange({name:'name',value})}} error={error.name} />
            <CredentialInput label={'Password'} password={true}  onChangeText={(value) =>{onChange({name:'password',value})}} error={error.password}/>
            <Button title="Sign in" onPress={auth.loading ? ()=> {console.log("er")} : ()=>  {onSubmit()}}/>
            <View style={{ backgroundColor : "black", height : 1, borderWidth:2}} />
            <Button title="Sign up" onPress={()=> {navigate(Register)}}/>
            {auth.loading && <ActivityIndicator size='large'/>}
        </View>
    )
}

const Register = () => {
    const [username,setUsername] = useState('')
    const [nameError,setNameError] = useState(false)
    const [password,setPassword] = useState('')
    const [passError,setPassError] = useState(false)
    const [repassword,setRepassword] = useState('')
    const [repassError,setRePassError] = useState(false)
    return (
        <View>
            <CredentialInput label={'Username'} onChangeText={setUsername} value={username} error={nameError} />
            <CredentialInput label={'Password'} password={true}  onChangeText={setPassword} value={password} error={passError}/>
            <CredentialInput label={'Repeat Password'}password={true}  onChangeText={setRepassword} value={repassword} error={repassError}/>
            <Button title="Sign in" onPress={()=> {
                    setNameError(username=='')
                    setPassError(password=='')
                    setRePassError(repassword=='')
                    if(username=='' || password=='' || repassword==''){
                        console.log('here')
                        return
                    }else{
                        alert("One step closer to register")
                    }
                }
            }/>
        </View>
    )
}



const stack = createStackNavigator()

export default function AuthNavigator() {
    return (
        <stack.Navigator>
            <stack.Screen
                name="Login"
                component={LoginValidator}
            ></stack.Screen>
            <stack.Screen
            name="Register"
            component={Register}></stack.Screen>
            </stack.Navigator>
    );
  }