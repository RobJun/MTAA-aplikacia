import React from 'react'
import {Image, TouchableOpacity} from 'react-native'



const BookCover = ({onPress, size, source, style}) =>{
    return (
        <TouchableOpacity onPress = {onPress}>
            <Image source={{uri:source}} 
            style={[{width:size, height:size*1.5, resizeMode: "contain"}, style]}/>
        </TouchableOpacity>
    )
}

export default BookCover