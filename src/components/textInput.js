import React, {useState} from "react";
import { View, StyleSheet, TextInput,Text } from "react-native";

const CredentialInput = ({label,value,onChangeText,password,error}) => {
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
        <Text>{label}</Text>
      <TextInput style={[styles.input, {borderColor:getBorderColor()}]}
        onChangeText={onChangeText}
        value={value}
        placeholder={'Enter ' + (password ? 'Password' : 'Username')}
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
        height: 50,
        paddingHorizontal:10
    },
    error : {
        color: "red",
        marginLeft:12
    },
    inputBox:{
        margin:10,
    }
})

export default CredentialInput;