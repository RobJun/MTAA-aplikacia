import React,{useContext,useState,useEffect,useCallback} from "react";
import {View,Text,FlatList,Image, StyleSheet,ScrollView,RefreshControl} from 'react-native'
import { clubContext } from ".";
import { API_SERVER } from "../../api_calls/constants";
import Button from "../../components/button";
import { globContext } from "../../context/globContext";
import CallButton from "../../components/callButton";
import { useNavigation } from '@react-navigation/native';
import UserList from "./Userlist";
import ProfileImage from "../../components/profileImage";
import BookCover from "../../components/BookCover";
import { fetchGroups, fetchInfo } from "../../api_calls/user_calls";


const ClubScreen = ({navigation,route}) => {
    const clubID = route.params.clubID
    const {auth:{user:{token,user_id}},setGroups,setUser,user,stun} = useContext(globContext)
    const {info, setInfo} = useContext(clubContext)
    const [ownerName,setOwnerName] = useState('')
    const [isOwner,setIsOwner] = useState(false)
    const [isPart,setIsPart] = useState(false)
    const {navigate} = useNavigation()
    const [refreshing, setRefreshing] = useState(false);


    const fetchClubInfo = () => {
        fetch(`http://${API_SERVER}/group/info/${clubID}/`)
        .then(response => response.json())
        .then(data => {
            data.photoPath = data.photoPath +`?time=${new Date().getTime()}`
            setInfo(data)
        })
    }


    const onRefresh = useCallback(()=>{
        setRefreshing(true)
        fetch(`http://${API_SERVER}/group/info/${clubID}/`)
        .then(response => response.json())
        .then(data => {
            data.photoPath = data.photoPath +`?time=${new Date().getTime()}`
            setInfo(data)
            setRefreshing(false)
        })
    },[])
    
    useEffect(() => {
        fetchClubInfo()
    }, [])

    useEffect(()=>{
        console.log("info changed")
        var p = false
        info.users.forEach(user => {
            if(user.owner === true){
                setOwnerName(user.displayName)
            }
            if(user_id === user.id){
                console.log(user.displayName)
                setIsPart(true)
                p = true
                if(user.owner === true){
                    setIsOwner(true)
                }
                return;
            }
        });
        if(!p){
            setIsPart(false)
        }

    },[info])


    const ownerButton = ()=>{
        console.log('Owner')
        navigation.navigate('Club_settings')
    }

    const memberButton = async ()=>{
        console.log('member')
        const response = await fetch(`http://${API_SERVER}/group/leave/${clubID}/`,{
            "method": "DELETE",
            "headers" : {
            "Authorization": `Token ${token}`
            }
        })
        if (response.status === 401 || response.status ===404 || response.status === 409){
            alert('error')
            return;
        }
        const data = await response.json()
        setInfo(data)
        fetchGroups(user_id,setGroups)
        fetchInfo(user_id,setUser)
    }

    const otherButton = async ()=>{
        console.log('other')
        console.log(token)
        console.log(`Token ${token}`)
        const response = await fetch(`http://${API_SERVER}/group/join/${clubID}/`,{
            "method": "PUT",
            "headers" : {
            "Authorization" : "Token " + token
            }
        })
        if (response.status === 401 || response.status ===404 || response.status === 409){
            alert('error')
            return;
        }
        const data = await response.json()
        setInfo(data)
        fetchGroups(user_id,setGroups)
        fetchInfo(user_id,setUser)
    }

    console.log(info.photoPath)
    return (
        <ScrollView
            refreshControl={
                <RefreshControl  refreshing={refreshing}
                onRefresh={onRefresh}
                />
            }>
            <View style={styles.clubHeader}>
                {isPart && <CallButton icon={"video"} onPress={() =>{
                    navigation.navigate('Club_video',{
                            username : user.displayName,
                            token : token,
                            roomID : clubID,
                            stun : stun
                        })}} style={styles.callButton}/>}
                <ProfileImage source={info.photoPath} size={180}/>
                <Text style={styles.clubHeaderName}>{info.name}</Text>
                <View style = {{flexDirection: "row", justifyContent: "space-evenly", marginLeft: 10, marginRight: 10}}>
                    <Text style={styles.clubHeaderOwner}>No. members: {info.count}</Text>
                    <Text style={styles.clubHeaderOwner}>Owner: {ownerName}</Text>
                </View>
            </View>
            <View>
                <View style={styles.firstSection}>
                    <Text style={styles.header}>About</Text>
                    <Text style={styles.text}>{info.info ? info.info : "About not set"}</Text>
                    <Text style={styles.header}>Rules</Text>
                    <Text style={styles.text}>{info.rules ? info.rules : "Rules not set"}</Text>
                </View>
                <View style={styles.secondSection}>
                    <Text style={styles.header}>Book of the week</Text>
                    { info.book_of_the_week ? <BookCover 
                                source={info.book_of_the_week.cover}
                                style={styles.bowImage}
                                onPress={()=>{ navigation.navigate('Club_Book',{bookID: info.book_of_the_week.id})}}/> 
                                : <Text style={styles.noBook}>No book of the week</Text>}
                </View>
                <View style={styles.thirdSection}>
                    <Text style={styles.header}>Members</Text>
                    <View style = {{marginRight: 20}}>
                        <UserList users={info.users} onSelect={(item)=>{navigation.navigate('Club_Member',{user_id:item.id})}} selectArray={[]}/>
                    </View>
                </View>
                <View style={styles.fourthSection}>
                    <Button onPress={isPart ? (isOwner ? ownerButton : memberButton) : otherButton} title={isPart ? (isOwner ? 'Settings' : 'Leave club') : 'Join Club'} style = {{backgroundColor: "#ee6f68", paddingVertical: 15}}/>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    member : {
        width: 70,
        height: 70,
        borderRadius: 70 / 2,
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
    clubHeader : {
        backgroundColor: '#ee6f68',
        alignItems:'center',
        paddingTop:70,
        paddingBottom:20
    },
    callButton : {
        position: 'absolute',
        top:0,
        right: 0,
        backgroundColor: '#FFFFFF00'
    },
    clubHeaderName : {
        paddingVertical: 10,
        fontSize: 30,
        fontWeight:'900',
        color:'black',
        fontFamily: 'serif'
    },
    clubHeaderOwner : {
        paddingVertical: 10,
        fontSize: 17,
        fontWeight:'500',
        color:'black',
        fontFamily: 'serif',
        marginRight: 20,
        marginLeft: 20
    },
    header : {
        color: 'black',
        fontFamily:'serif',
        fontWeight:'700',
        fontSize:22,
        marginLeft:20,
        marginVertical:5,
    },
    bowImage : {
        width:150,
        height:230,
        alignSelf:'center',
        marginVertical:20,
    },
    secondSection : {
        backgroundColor : '#5e8d5a',
    },
    text : {
        color : 'black',
        marginHorizontal:30,
        fontSize: 17,
        fontFamily:'serif'
    },
    noBook : {
        alignSelf: 'center',
        marginVertical:115,
        fontSize: 20
    },
    firstSection : {
        marginTop:10,
        marginBottom:25
    },
    thirdSection : {
        marginTop: 20
    }
})


export default ClubScreen;