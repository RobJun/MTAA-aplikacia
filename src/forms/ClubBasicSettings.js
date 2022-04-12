import React from "react"
import { View, StyleSheet,ScrollView} from "react-native"
import CredentialInput from "../components/textInput"
import Button from "../components/button"
import ProfileImage from "../components/profileImage"


const BasicSettings = ({formImage,selectImage,resetImage, onChange,error,form,title,onPress,defaultImage, scrollable=false}) =>{
    
    const child =(
            <View>
            <View style={styles.clubHeader}>
                <ProfileImage source={formImage ? formImage.uri : defaultImage} size={180} local={true}/>
                <Button onPress={selectImage} title='Change Image' style = {{backgroundColor: "#5e8d5a", marginTop: 20, paddingVertical: 15}}/>
                {formImage && <Button onPress={resetImage} title='Reset Image' style = {{backgroundColor: "#5e8d5a", paddingVertical: 15}} />}
            </View>
            <CredentialInput label={'Name'} placeholder = {"Enter club name, max 20 characters"} multi = {false} value={form.name} onChangeText={(value)=>{onChange({name:'name',value})}} error={error.name}/>
            <CredentialInput label={'About'} height = {200} multi = {true} value={form.info} onChangeText={(value)=>{onChange({name:'info',value})}}/>
            <CredentialInput label={'Rules'} height = {200} multi = {true} value={form.rules} onChangeText={(value)=>{onChange({name:'rules',value})}}/>
            <Button style = {{backgroundColor: "#5e8d5a", paddingVertical: 15}} title={title} onPress={onPress}/>
            </View>
    )

    
    return (scrollable ? (<ScrollView>{child}</ScrollView>) : child)
}


const styles = StyleSheet.create({
    clubHeader : {
        backgroundColor: '#ee6f68',
        alignItems:'center',
        paddingTop:20,
        paddingBottom:20
    },
})


export default BasicSettings;