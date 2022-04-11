import React from 'react';
import { TouchableOpacity,Text, StyleSheet} from 'react-native'


const Button = (props) => {
    return (
            <TouchableOpacity onPress={props.onPress} style={[styles.button, props.style]}>
                <Text style={styles.buttonText}>{props.title}</Text>
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "grey",
        alignItems:'center',
        marginHorizontal:20,
        margin: 10,
        paddingVertical: 20,
        borderRadius:10,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 40,
    },
    buttonText: {
        fontSize: 20,
        color: 'black'
    }
})
export default Button;