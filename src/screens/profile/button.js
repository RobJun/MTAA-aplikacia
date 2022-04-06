import React from "react"
import { TouchableOpacity,Text, StyleSheet} from 'react-native'

const ButtonSettings = (props) => {
    return (
            <TouchableOpacity onPress={props.onPress} style={styles.button}>
                <Text style={styles.buttonText}>{props.title}</Text>
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#c6d7b9",
        alignItems:'center',
        marginHorizontal: 20,
        marginTop: 10,
        paddingVertical: 10,
        borderRadius:10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 40,
        marginBottom: 20
    },
    buttonText: {
        fontSize: 20,
        color: "#5e8d5a",
        fontWeight: "bold"
    }
})
export default ButtonSettings;