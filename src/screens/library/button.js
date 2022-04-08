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
        backgroundColor: "grey",
        alignItems:'center',
        marginHorizontal: 20,
        marginTop: 10,
        paddingVertical: 10,
        borderRadius:10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 40
    },
    buttonText: {
        fontSize: 20,
    }
})
export default ButtonLibrary;