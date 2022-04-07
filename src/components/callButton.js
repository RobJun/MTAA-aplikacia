import React from 'react';
import { TouchableOpacity,Text, StyleSheet} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const CallButton = ({onPress,icon,color = 'grey',style}) => {
    return (
            <TouchableOpacity onPress={onPress} style={[styles.button,{backgroundColor:color},style]}>
                <MaterialCommunityIcons name={icon} size={30}/>
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "grey",
        marginHorizontal:10,
        margin: 10,
        padding: 20,
        borderRadius:50,
        alignSelf:'flex-start'
    },
    buttonText: {
        fontSize: 20,
    }
})
export default CallButton;