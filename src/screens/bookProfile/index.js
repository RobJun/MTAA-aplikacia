import React, { useEffect, useState } from "react"
import {View, Image, Text, StyleSheet, ImageBackground, ScrollView, Searchbar} from 'react-native'

const BookProfile = () => {
    const [groups, setGroups] = useState()
    
    const fetchGroups = () => {
        fetch("http://10.0.2.2:8000/find/info/9781406379167/")
        .then(response => response.json())
        .then(data => setGroups(data))
    }

    useEffect(() => {
        fetchGroups()
    }, [])

    return (
        <View>
            <Text style={styles.text}>Clubs</Text>
            <ScrollView horizontal = {true} style={containerStyle.rowContainer} showsHorizontalScrollIndicator={false}>
                {groups.map(group => (
                    <ImageBackground style = {styles.photos} key={group.id} onPress={ ()=> Profile }>{group.photoPath}</ImageBackground>,
                    <Text style={styles.titles} key={group.id} onPress={ ()=> Profile} >{group.name}</Text>
                ))}
            </ScrollView>
        </View>
    )
 }

 const containerStyle = StyleSheet.create({
    container: {
      padding: 8,
      backgroundColor: "#ffffff",
    },
    rowContainer: {
      flexDirection: 'row',
    }
  }); 

const styles = StyleSheet.create({
    photos: {
        width: '10%',
        height: '10%'
    },
    text : {
        display:'flex',
        flexDirection:'row',
        fontSize: 30,
        fontFamily:'serif',
        color: "black",
        marginTop: 30,
        marginLeft: 20,
        fontWeight: 'bold',
    },
    titles: {
        display:'flex',
        flexDirection:'row',
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        marginTop: 30,
        marginLeft: 20,
        fontWeight: 'bold',
    }
})

export default BookProfile