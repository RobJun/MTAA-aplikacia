import React from "react";
import {StyleSheet,View,Text,FlatList,TouchableOpacity, Image} from 'react-native'
import ProfileImage from "./profileImage";


const UserList = ({users, onSelect,selectArray}) =>{
    return <FlatList
    horizontal
    scrollEnabled
    showsHorizontalScrollIndicator={false}
    data={users}
    extraData={selectArray}
    renderItem={({item})=>{
        return (
            <TouchableOpacity onPress={()=>{onSelect(item)}}>
        <View>
            <ProfileImage source={item.photoPath} size={70} style={[styles.member,selectArray.indexOf(item.id) > -1 &&{borderColor:'red',borderWidth:7}]}/>
            <Text style={styles.name} key={item.id}>{item.displayName}</Text>
        </View>
        </TouchableOpacity>)
    }}
    keyExtractor={(item)=>item.id}
    />

}


const styles = StyleSheet.create({
    member : {
        overflow: "hidden",
        marginLeft: 20,
        alignItems: "center"
    },
    name : {
        display:'flex',
        flexDirection:'row',
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        textAlign: "center",
        fontWeight: 'bold',
        marginLeft: 25,
        marginBottom: 20
    },
})


export default UserList;

