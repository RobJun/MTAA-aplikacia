import React from 'react';
import { TouchableOpacity,Text, StyleSheet, ActivityIndicator,View} from 'react-native'


const Button = ({style,textStyle,onPress,visible = false, title}) => {
    return (
            <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
                <ActivityIndicator size="large" animating={visible} style={styles.indicatorLeft}/>
                <Text style={[styles.buttonText,textStyle]}>{title}</Text>
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

        textAlign:'center',
        fontSize: 20,
        color: 'black',
    },
    indicatorLeft : {
        position:'absolute',
        left:10,
        top:"40%",
    },
})
export default Button;