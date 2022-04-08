import React from 'react'
import {Image,StyleSheet} from 'react-native'



const ProfileImage = ({size,source,style, local= false}) =>{
    if(local) {
        return (<Image 
                source={{uri:source}}
                style={[{width:size,height:size, borderRadius : size/2},styles.image,style]}
                />)
    }
    return (<Image 
            source={{uri:source}}
            style={[{width:size,height:size, borderRadius : size/2},styles.image,style]}
            />)
    }

const styles = StyleSheet.create({
    image :{

    }
})


export default ProfileImage