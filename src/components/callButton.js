import React from 'react';
import { TouchableOpacity,Text, StyleSheet} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const CallButton = ({onPress,icon}) => {
    return (
            <TouchableOpacity onPress={onPress} style={styles.button}>
                <MaterialCommunityIcons name={icon} size={30}/>
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "grey",
        alignItems:'center',
        marginHorizontal:10,
        margin: 10,
        padding: 20,
        borderRadius:50,
    },
    buttonText: {
        fontSize: 20,
    }
})
export default CallButton;