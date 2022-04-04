import React from 'react';
import {View,Image,Text,StyleSheet} from 'react-native'


const SplashScreen = () => {
 return <View style={styles.view}>
     <Image source={require('../../../assets/logo.png')} style={styles.logo}></Image>
     <Text style={styles.text}>BookRef</Text>
     <Text style={styles.credit}>App by Dana Hrivnákova & Róbert Junas</Text>
 </View>
}


const styles= StyleSheet.create({
    view :{
        justifyContent:'center',
        alignItems:'center',
        flex:1
    },
    text : {
        display:'flex',
        flexDirection:'row',
        fontSize:30,
        fontFamily:'serif'
    },
    logo : {
        display:'flex',
    
        flexDirection:'row',
        width: '40%',
        height: '40%',
    },
    credit : {
        position:'absolute',
        bottom: 10
    }
})


export default SplashScreen