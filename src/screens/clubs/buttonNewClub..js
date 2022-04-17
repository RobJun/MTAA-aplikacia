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
        marginRight: 25,
        marginTop: 10,
        padding: 10,
        paddingHorizontal: 15, 
        borderRadius: 100,
    },
    buttonText: {
        fontSize: 15,
    }
})
export default ButtonNewClub;