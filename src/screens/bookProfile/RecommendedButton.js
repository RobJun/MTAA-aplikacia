import React from 'react';
import { TouchableOpacity,Text, StyleSheet} from 'react-native'


const RecommendedButton = (props) => {
    return (
            <TouchableOpacity onPress={props.onPress} style={[styles.button, {backgroundColor: props.color}]}>
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
    },
    buttonText: {
        fontSize: 20,
        color: 'black'
    }
})
export default RecommendedButton;