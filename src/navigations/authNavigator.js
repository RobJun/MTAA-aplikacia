import React, {useContext,useState} from 'react';
import {Text,View,ActivityIndicator,Alert,AsyncS} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import Button from '../components/button';
import { globContext } from '../context/globContext';
import CredentialInput from '../components/textInput';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import LoginValidator from '../screens/login'


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