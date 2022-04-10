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
                <Button onPress={selectImage} title='Change Image' />
                {formImage && <Button onPress={resetImage} title='Reset Image'/>}
            </View>
            <CredentialInput label={'Name'} value={form.name} onChangeText={(value)=>{onChange({name:'name',value})}} error={error.name}/>
            <CredentialInput label={'About'} value={form.info} onChangeText={(value)=>{onChange({name:'info',value})}}/>
            <CredentialInput label={'Rules'} value={form.rules} onChangeText={(value)=>{onChange({name:'rules',value})}}/>
            <Button title={title} onPress={onPress}/>
            </View>
    )

    
    return (scrollable ? (<ScrollView>{child}</ScrollView>) : child)
}


const styles = StyleSheet.create({
    clubHeader : {
        backgroundColor: '#ee6f68',
        alignItems:'center',
        paddingTop:70,
        paddingBottom:20
    },
})


export default BasicSettings;