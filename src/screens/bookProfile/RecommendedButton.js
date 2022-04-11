import React from 'react';
import { TouchableOpacity,Text, StyleSheet} from 'react-native'


const RecommendedButton = (props) => {
    return (
            <TouchableOpacity onPress={props.onPress} style={styles.button}>
                <Text style={styles.buttonText}>{props.title}</Text>
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        margin: 10,
        paddingVertical: 12,
        borderRadius:10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 1, 
    },
    buttonText: {
        fontSize: 18,
        color: 'black'
    }
})
export default RecommendedButton;