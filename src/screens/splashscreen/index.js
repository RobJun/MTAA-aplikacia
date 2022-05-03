import React from 'react';
import {View,Image,Text,StyleSheet, ActivityIndicator} from 'react-native'


const SplashScreen = () => {
 return <View style = {styles.view}>
     <Image source={require('../../../assets/logo.png')} style={styles.logo}></Image>
     <ActivityIndicator />
     <Text style={styles.text}>BookRef</Text>
     <Text style={styles.credit}>App by Dana Hrivnákova & Róbert Junas</Text>
 </View>
}


const styles = StyleSheet.create({
    view : {
        justifyContent:'center',
        alignItems:'center',
        flex: 1,
        backgroundColor: "#393991",
    },
    text : {
        display:'flex',
        flexDirection:'row',
        fontSize: 30,
        fontFamily:'serif', 
        color: "white"
    },
    logo : {
        display:'flex',
    
        flexDirection:'row',
        width: 200,
        height: 200,
    },
    credit : {
        position:'absolute',
        bottom: 10,
        color: "white"
    },
})

export default SplashScreen