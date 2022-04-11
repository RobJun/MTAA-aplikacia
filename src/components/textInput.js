import React, {useState} from "react";
import { View, StyleSheet, TextInput,Text } from "react-native";

const CredentialInput = ({label,value,onChangeText,password,error, placeholder, multi, height}) => {
    const [focused, setFocused] = useState(false)

    const getBorderColor = () => {
        if(focused) return "blue"
        if (error){
            return "red"
        }
        return "black"
    }
    return (
    <View style={styles.inputBox}>
        <Text style = {styles.label}>{label}</Text>
        <TextInput style={[styles.input, {borderColor:getBorderColor(), height: height}]} multiline = {multi}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        secureTextEntry={password} 
        onFocus={()=>{
            setFocused(true)
        }}
        onBlur={()=> setFocused(false)}
       />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
    input : {
        borderWidth: 2,
        fontSize:20,
        margin: 12,
        marginBottom:2,
        height: 30,
        paddingHorizontal:10, 
        color: "black",
        backgroundColor: "lightgrey",
        textAlignVertical: 'top'
    },
    error : {
        color: "red",
        marginLeft:12
    },
    inputBox:{
        margin:10
    },
    label: {
        fontSize: 20,
        color: "black",
        marginLeft: 10, 
        fontWeight: "500"
    }
})

export default CredentialInput;