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
        <View style={{marginTop:'10%'}}>
            {auth.loading && <ActivityIndicator size='large'/>}
            <View  style={{justifyContent:'center',alignItems:'center'}}>
                <Image source={require('../../../assets/logo_tr.png')} style={{width:170,height:170}} o></Image>
            </View>
            <ScrollView style={{maxHeight:'80%'}}>
                <CredentialInput label={'Username'} multi = {false} onChangeText={(value)=>{onChange({name:'name',value})}}  error={error.name} />
                <CredentialInput label={'Password'} multi = {false} password={true}  onChangeText={(value)=>onChange({name:'password',value})}  error={error.password}/>
                <CredentialInput label={'Repeat Password'} multi = {false} password={true}  onChangeText={(value)=> {onChange({name:'repassword',value})}} error={error.repassword}/>
                <Button title="Sign in" onPress={auth.loading ? () => {console.log('loading button disabled')} : ()=>{onSubmit()}}/>
            </ScrollView>
        </View>
    )
}

export default Register;