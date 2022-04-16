import React from "react"
import { TouchableOpacity,Text, StyleSheet} from 'react-native'

const ButtonLibrary = (props) => {
    return (
            <TouchableOpacity onPress={props.onPress} style={[styles.button, {backgroundColor: props.color}]}>
                <Text style={styles.buttonText}>{props.title}</Text>
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems:'center',
        marginTop: 20,
        paddingVertical: 5,
        borderRadius: 40,
        paddingLeft: 15,
        paddingRight: 15,
        marginLeft: 15,
        marginRight: 15
    },
    buttonText: {
        fontSize: 20,
    }
})
export default ButtonLibrary;