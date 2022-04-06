import React, { useEffect, useState} from "react"
import {View, Image, Text, StyleSheet, FlatList, ScrollView} from 'react-native'
import Button from "../../components/button"


function NewClub() {
    console.log("ahoj")
}

const Clubs = () => {
    const [clubs, setClubs] = useState([])
    
    const fetchClubs = () => {
        fetch("http://10.0.2.2:8000/user/groups/?q=312b4905-bdbe-4dc3-a4f5-372636d32840")
        .then(response => response.json())
        .then(data => setClubs(data))
    }
    
    useEffect(() => {
        fetchClubs()
    }, [])

   
    return (
        <ScrollView>
             <View style={{flexDirection:'row',  alignItems:"center", justifyContent: "space-evenly",}}>
                 <Text style = {styles.title1}>Your bookclubs</Text>
                <Button onPress={NewClub} title="Create new club" style = {styles.button}/>
            </View>
            <View>
                <FlatList
                    scrollEnabled
                    data={clubs}
                    renderItem={({item})=>{
                        return (
                        <View style = {{flexDirection:'row', flex: 1}}>
                            <View style = {{flexDirection: "row", flex: 1, width: "35%", height: 100, marginLeft:10, marginTop: 20, backgroundColor: "#f17c56", borderTopLeftRadius: 360, borderBottomLeftRadius: 360}}>  
                                <Image source={{uri:item.photoPath}} style={styles.image}/>
                            </View>
                            <View style = {{width: "65%", height: 100, marginRight: 10, marginTop: 20, backgroundColor: "#f17c56", borderTopRightRadius: 30, borderBottomRightRadius: 30}}>
                                <Text style={styles.title}>{item.name}</Text>
                                <Text style={styles.text}>Number of members: {item.number_of_members}</Text>
                            </View>
                        </View>)
                    }}
                    keyExtractor={(item)=>item.id}
                />
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
        width: 100, 
        height: 100, 
        borderRadius: 360 / 2,
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
        marginLeft: 50,
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