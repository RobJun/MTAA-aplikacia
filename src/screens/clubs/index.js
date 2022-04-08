import { useNavigation } from "@react-navigation/native"
import React, { useEffect, useState, useContext} from "react"
import {View, Text, StyleSheet, FlatList, ScrollView,TouchableOpacity} from 'react-native'
import ButtonNewClub from "./buttonNewClub."
import { API_SERVER } from "../../api_calls/constants";
import { globContext } from "../../context/globContext";
import ProfileImage from "../../components/profileImage";

function NewClub() {
    console.log("ahoj")
}

const Clubs = () => {
    const {auth:{user:{token,user_id}}} = useContext(globContext)
    const {navigate} = useNavigation()
    const [clubs, setClubs] = useState([])
    
    const fetchClubs = () => {
        fetch(`http://${API_SERVER}/user/groups/?q=${user_id}`)
        .then(response => response.json())
        .then(data => setClubs(data))
    }
    
    useEffect(() => {
        fetchClubs()
    }, [])

   
    return (
        <ScrollView>
             <View style={{marginTop: 20, flexDirection:'row', justifyContent: "space-between", marginLeft: 20}}>
                <Text style = {styles.title1}>Your bookclubs</Text>
                <ButtonNewClub onPress={NewClub} title="Create new club"/>
            </View>
            <View>
                {clubs == [] ? <Text>You are not in any bookclub</Text> : 
                <FlatList
                    scrollEnabled
                    data={clubs}
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
        marginLeft: 5,
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
    }
})

export default Clubs