import React, {useContext,useState} from 'react';
import { globContext } from '../../context/globContext'
import {Text,View,ActivityIndicator,Alert,AsyncS} from 'react-native'
import CredentialInput from '../../components/textInput';
import Button from '../../components/button';
import { useNavigation } from '@react-navigation/native';

const Login = ({onSubmit,onChange,form,error}) => {
    const {navigate} = useNavigation();
    const {auth,setAuth} = useContext(globContext)
    if (auth.error) {
        console.log(auth)
        Alert.alert(auth.error, auth.error, [{text: "toto stlac",onPress: () => {setAuth({type: "CLEAR"})}}])
    }
    return (
        <View>
            {auth.loading && <ActivityIndicator size='large'/>}
            <CredentialInput label={'Username'} onChangeText={(value) =>{onChange({name:'name',value})}} error={error.name} />
            <CredentialInput label={'Password'} password={true}  onChangeText={(value) =>{onChange({name:'password',value})}} error={error.password}/>
            <Button title="Sign in" onPress={auth.loading ? ()=> {console.log("er")} : ()=>  {onSubmit()}}/>
            <View style={{ backgroundColor : "black", height : 1, borderWidth:2}} />
            <Button title="Sign up" onPress={()=> {navigate(Register)}}/>
        </View>
    )
}


export default Login;
