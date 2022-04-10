import { useNavigation } from "@react-navigation/native"
import React, {useContext} from "react"
import {View, Text, StyleSheet, FlatList, ScrollView,TouchableOpacity} from 'react-native'
import ButtonNewClub from "./buttonNewClub."
import { globContext } from "../../context/globContext";
import ProfileImage from "../../components/profileImage";

const Clubs = () => {
    const {auth:{user:{token,user_id}},groups,setGroups} = useContext(globContext)
    const {navigate} = useNavigation()
   
    return (
        <ScrollView>
             <View style={{marginTop: 20, flexDirection:'row', justifyContent: "space-between", marginLeft: 20}}>
                <Text style = {styles.title1}>My bookclubs</Text>
                <ButtonNewClub onPress={()=>{navigate('ClubsNav',{screen:'Create_Club'})}} title="Create new club"/>
            </View>
            <View>
                {groups == [] ? <Text>You are not in any bookclub</Text> : 
                <FlatList
                    scrollEnabled
                    data={groups}
                    renderItem={({item})=>{
                        console.log(item.id)
                        return (
                        <TouchableOpacity onPress={()=>{navigate('ClubsNav', {screen:'Club', params:{screen: 'Club_screen', params:{clubID:item.id}}})}}>
                            <View style = {{flexDirection:'row', flex: 1}}>
                                <View style = {{flexDirection: "row", flex: 1, width: "35%", height: 100, marginLeft:15, marginTop: 20, backgroundColor: "#f17c56", borderTopLeftRadius: 360, borderBottomLeftRadius: 360}}>  
                                    <ProfileImage size = {100} source={item.photoPath} style={styles.image}/>
                                </View>
                                <View style = {{width: "65%", height: 100, marginRight: 20, marginTop: 20, backgroundColor: "#f17c56", borderTopRightRadius: 20, borderBottomRightRadius: 20}}>
                                    <Text style={styles.title}>{item.name}</Text>
                                    <Text style={styles.text}>Number of members: {item.number_of_members}</Text>
                                </View>
                                </View>
                        </TouchableOpacity>)
                    }}
                    keyExtractor={(item)=>item.id}
                /> }
            </View>
        </ScrollView>
    )
 }

 const styles = StyleSheet.create({
    club: {
        width: 100,
        height: 100,
        borderRadius: 150 / 2,
        overflow: "hidden",
        marginLeft: 20,
        alignItems: "center"
    },
    image: {
        overflow: "hidden",
        marginLeft: 0,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: "#f17c56"
    },
    title1 : {
        fontSize: 25,
        fontFamily:'serif',
        color: "black",
        marginTop: 15,
        marginRight: 10,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    title : {
        fontSize: 20,
        fontFamily:'serif',
        color: "black",
        marginTop: 15,
        marginRight: 10,
        marginLeft: 15,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        textAlign: "left",
        marginLeft: 15,
        marginRight: 10,
        marginBottom: 10,
    }
})

export default Clubs