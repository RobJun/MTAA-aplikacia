import React, {useContext,useState} from 'react';
import { globContext } from '../../context/globContext'
import {Text,View,ActivityIndicator,Alert,Image,ScrollView} from 'react-native'
import CredentialInput from '../../components/textInput';
import Button from '../../components/button';
import { useNavigation } from '@react-navigation/native';


const Login = ({onSubmit,onChange,form,error}) => {
    const {navigate} = useNavigation();
    const {auth,setAuth} = useContext(globContext)
    if (auth.error) {
        console.log(auth)
        Alert.alert(auth.error, auth.error, [{text: "OK",onPress: () => {setAuth({type: "CLEAR"})}}])
    }
    return (
        <ScrollView style={{marginTop:'10%'}}>
            <View  style={{justifyContent:'center',alignItems:'center'}}>
                <Image source={require('../../../assets/logo_tr.png')} style={{width:170,height:170}} o></Image>
            </View>
            <CredentialInput label={'Username'}  multi = {false} placeholder = {"Enter username"} value={form.name} onChangeText={(value) =>{onChange({name:'name',value})}} error={error.name} />
            <CredentialInput label={'Password'} multi = {false} placeholder = {"Enter password"} password={true} value={form.password} onChangeText={(value) =>{onChange({name:'password',value})}} error={error.password}/>
            <Button title="Sign in" onPress={auth.loading ? ()=> {console.log("er")} : ()=>  {onSubmit()}} visible={auth.loading}/>
            <View style={{ backgroundColor : "black", height : 1, borderWidth:2}} />
            <Button title="Sign up" onPress={()=> {navigate('Register')}} />
        </ScrollView>
    )
}


export default Login;
