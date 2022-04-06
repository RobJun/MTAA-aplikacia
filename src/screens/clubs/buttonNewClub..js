import React from "react"
import { TouchableOpacity,Text, StyleSheet} from 'react-native'

const ButtonNewClub = (props) => {
    return (
            <TouchableOpacity onPress={props.onPress} style={styles.button}>
                <Text style={styles.buttonText}>{props.title}</Text>
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        overflow: "visible",
        backgroundColor: "#5e8d5a",
        alignItems:'center',
        marginRight: 20,
        marginTop: 10,
        paddingVertical: 10,
        borderRadius:10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 40
    },
    buttonText: {
        fontSize: 15,
    }
})
export default ButtonNewClub;