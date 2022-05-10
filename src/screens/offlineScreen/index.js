import React, {useContext,useState,useEffect, useCallback} from "react"
import {View, Image, Dimensions} from 'react-native'

const OfflineScreen = ({route}) => { 
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex: 1, alignItems: "center", width: "125%", height: Dimensions.get('window').height - 140}}>
                        <Image source={require('../../../assets/nointernet.png')} style={{position: "absolute", bottom: 0, alignSelf: "flex-end"}}></Image>
        </View></View>
    )

    
}

export default OfflineScreen