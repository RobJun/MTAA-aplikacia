import React, {useContext} from "react"
import {View, Text,StyleSheet, ScrollView, FlatList} from 'react-native'
import ButtonSettings from "./button"
import ProfileImage from "../../components/profileImage"
import BookCover from "../../components/BookCover"
import { useNavigation } from '@react-navigation/native';
import { globContext } from "../../context/globContext";

const Profile = () => {
    const {navigate} = useNavigation()
    const {auth:{user:{token,user_id}},user,setUser} = useContext(globContext)
    
    return (
        <ScrollView>
            <View style={{backgroundColor: "#c6d7b9", flexDirection:'row',  alignItems:"center", justifyContent: "space-evenly"}}>
                <View style = {{width:"40%", height: 130, marginLeft: 20, marginTop: 20, marginBottom: 20}}>
                    <ProfileImage size = {130} source={user.photoPath} style={styles.image}/>
                </View>
                <View style = {{width:"60%", marginRight: 20, marginTop: 20, marginBottom: 20, height: 130}}>
                    <Text style = {styles.title}>{user.displayName}</Text>
                    <Text style = {styles.text}>{user.bio}</Text>
                </View>
            </View>
            <View style={{backgroundColor: "#c6d7b9", flexDirection:'row',  alignItems:"center", justifyContent: "space-evenly"}}>
                    <View style = {styles.border}>
                        <Text style={styles.infoTop}>Wishlist</Text>
                        <Text style = {styles.infoBott}>{user.wishlist}</Text>
                    </View>
                    <View style = {styles.border}>
                        <Text style={styles.infoTop}>Reading</Text>
                        <Text style = {styles.infoBott}>{user.currently_reading}</Text>
                    </View>
                    <View style = {styles.border}>
                        <Text style={styles.infoTop}>Completed</Text>
                        <Text style = {styles.infoBott}>{user.completed}</Text>
                    </View>
            </View>
            <View style={{marginLeft: 20, marginRight: 20}}>
                <Text style={styles.title}>Bookclubs</Text>
                {user.clubs.length == 0 ? <Text style = {styles.name}>You are not in any bookclub</Text> : 
                <View>
                    <FlatList
                        horizontal
                        scrollEnabled
                        showsHorizontalScrollIndicator={false}
                        data={user.clubs}
                        renderItem={({item})=>{
                            return (<View style = {{marginRight: 15}}>
                                <ProfileImage size = {100} source={item.photoPath} style={styles.club}/>
                                <Text style={styles.name} key={item.id}>{item.name.length > 8 ? `${item.name.substring(0,6)}...` : item.name}</Text>
                            </View>)
                        }}
                        keyExtractor={(item)=>item.id}
                    />
                </View>
                }
            </View>
            <View style={{marginLeft: 20, marginRight: 20, marginBottom: 20}}>
                <Text style={styles.title}>Recommended books</Text>
                {user.recommended_books.length == 0 ? <Text style = {styles.name}>You don't have any recommended books</Text> : 
                    <View>
                        <FlatList
                            horizontal
                            scrollEnabled
                            showsHorizontalScrollIndicator={false}
                            data={user.recommended_books}
                            renderItem={({item})=>{
                                return (
                                <View style = {{marginRight: 15}}>
                                    <BookCover onPress = {()=>{navigate('ProfileNav', {screen: 'Book', params:{bookID:item.id}})}} 
                                    source = {item.cover} size =  {130} style = {{marginLeft: 10}}/>   
                                </View>)
                            }}
                            keyExtractor={(item)=>item.id}
                        />
                    </View>
                }
            </View>
            <ButtonSettings onPress = {()=>{navigate('ProfileNav', {screen: 'Settings'})}} title="Settings"/>
        </ScrollView>
     )
}

const styles = StyleSheet.create({
    border: {
        borderBottomWidth: 3,
        borderColor: "#5e8d5a",
        borderTopWidth: 3,
        marginBottom: 30,
    },
    infoTop: {
        fontSize: 17,
        color: "black",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        textAlign: "center",
    },
    infoBott: {
        fontSize: 25,
        color: "black",
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        textAlign: "center"
    },
    club: {
        overflow: "hidden",
        alignItems: "center"
    },
    image: {
        overflow: "hidden",
        marginLeft: 10,
        marginBottom: 5,
    },
    title : {
        fontSize: 20,
        fontFamily:'serif',
        color: "black",
        marginTop: 10,
        marginRight: 10,
        marginLeft: 5,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        textAlign: "left",
        marginLeft: 5,
        marginRight: 10,
        marginBottom: 10,
    },
    name: {
        display:'flex',
        flexDirection:'row',
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        textAlign: "center",
        marginTop: 5,
        marginBottom: 20
    }
})

export default Profile