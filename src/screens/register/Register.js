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
            {auth.loading && <ActivityIndicator size='large'/>}
            <View  style={{justifyContent:'center',alignItems:'center'}}>
                <Image source={require('../../../assets/logo_tr.png')} style={{width:170,height:170}} o></Image>
            </View>
            <View style={{maxHeight:'80%'}}>
                <CredentialInput label={'Username'} placeholder = {"Enter display name, max 20 characters"}  multi = {false} onChangeText={(value)=>{onChange({name:'name',value})}}  error={error.name} />
                <CredentialInput label={'Password'} placeholder= {"Enter password, min 8 char"} multi = {false} password={true}  onChangeText={(value)=>onChange({name:'password',value})}  error={error.password}/>
                <CredentialInput label={'Repeat Password'} placeholder= {"Repeat password"} multi = {false} password={true}  onChangeText={(value)=> {onChange({name:'repassword',value})}} error={error.repassword}/>
                <Button title="Sign in" onPress={auth.loading ? () => {console.log('loading button disabled')} : ()=>{onSubmit()}}/>
            </View>
        </ScrollView>
    )
}

export default Register;