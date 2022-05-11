import React from "react";
import {StyleSheet,View,Text,FlatList,TouchableOpacity, Image} from 'react-native'
import ProfileImage from "./profileImage";

const UserList = ({users, userData, onSelect,selectArray}) =>{
    return <FlatList
    horizontal
    scrollEnabled
    showsHorizontalScrollIndicator={false}
    data={users}
    extraData={selectArray}
    renderItem={({item})=>{
        if (item.id === userData.id) {
            return (
                <TouchableOpacity onPress={()=>{onSelect(item)}}>
            <View>
                <ProfileImage source={userData.photoPath} size={70} style={[styles.member,selectArray.indexOf(userData.id) > -1 &&{borderColor:'red',borderWidth:7}]}/>
                <Text style={styles.name} key={userData.id}>{userData.displayName.length > 6 ? `${userData.displayName.substring(0,5)}...` : userData.displayName}</Text>
            </View>
            </TouchableOpacity>)
        }

        return (
            <TouchableOpacity onPress={()=>{onSelect(item)}}>
        <View>
            <ProfileImage source={item.photoPath} size={70} style={[styles.member,selectArray.indexOf(item.id) > -1 &&{borderColor:'red',borderWidth:7}]}/>
            <Text style={styles.name} key={item.id}>{item.displayName.length > 6 ? `${item.displayName.substring(0,5)}...` : item.displayName}</Text>
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

