import React, {useContext,useState} from 'react';
import {View,ActivityIndicator,Alert,Image,ScrollView} from 'react-native'
import CredentialInput from '../../components/textInput';
import Button from '../../components/button';
import { globContext } from '../../context/globContext';

const Register = ({onSubmit,onChange,form,error,navigation}) => {
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
            <View style={{maxHeight:'80%'}}>
                <CredentialInput label={'Username'} placeholder = {"Enter userame, 5-20 characters"}  multi = {false} value={form.name} onChangeText={(value)=>{onChange({name:'name',value})}}  error={error.name} />
                <CredentialInput label={'Password'} placeholder= {"Enter password, 8-32 characters"} multi = {false} password={true} value={form.password} onChangeText={(value)=>onChange({name:'password',value})}  error={error.password}/>
                <CredentialInput label={'Repeat Password'} placeholder= {"Repeat password"} multi = {false} password={true} value={form.repassword} onChangeText={(value)=> {onChange({name:'repassword',value})}} error={error.repassword}/>
                <Button title="Sign in" onPress={auth.loading ? () => {console.log('loading button disabled')} : ()=>{onSubmit()}} visible={auth.loading}/>
            </View>
        </ScrollView>
    )
}

export default Register;