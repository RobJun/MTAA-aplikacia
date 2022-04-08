import React, {useEffect, useState, useContext} from "react"
import {View,Image,Text,StyleSheet, ScrollView, FlatList, formImage, form} from 'react-native'
import ButtonSettings from "./button"
import ProfileImage from "../../components/profileImage"
import { useNavigation } from '@react-navigation/native';
import Button from "../../components/button";

const Settings = (route) => {
    const Info = route.params.info
    return (
            <View>
                <View style={styles.clubHeader}>
                    <ProfileImage source={formImage ? formImage.uri : Info.photoPath} size={180} local={true}/>
                    <Button onPress={selectImage} title='Change Image'></Button>
                    {formImage && <Button onPress={resetImage} title='Reset Image'/>}
                </View>
                <CredentialInput label={'Display name'} value={form.displayName} onChangeText={(value)=>{onChange({name:'displayName',value})}} error={error.name}/>
                <CredentialInput label={'Bio'} value={form.bio} onChangeText={(value)=>{onChange({name:'bio',value})}}/>
            </View>
        )
    }

const styles = StyleSheet.create({
    border: {
        borderBottomWidth: 3,
        borderColor: "#5e8d5a",
        borderTopWidth: 3,
        marginBottom: 30,
    },
    infoTop: {
        fontSize: 17,
        color: "black",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        textAlign: "center",
        
    },
    infoBott: {
        fontSize: 25,
        color: "black",
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        textAlign: "center"
    },
    club: {
        overflow: "hidden",
        alignItems: "center"
    },
    image: {
        overflow: "hidden",
        marginLeft: 10,
        marginBottom: 5,
    },
    title : {
        fontSize: 20,
        fontFamily:'serif',
        color: "black",
        marginTop: 5,
        marginRight: 10,
        marginLeft: 5,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        textAlign: "left",
        marginLeft: 5,
        marginRight: 10,
        marginBottom: 10,
    },
    name: {
        display:'flex',
        flexDirection:'row',
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        textAlign: "center",
        marginTop: 5,
        marginBottom: 20
    }
})



export default Settings