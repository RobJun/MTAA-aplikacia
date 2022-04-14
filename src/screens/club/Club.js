import React,{useContext,useState,useEffect,useCallback} from "react";
import {View,Text,FlatList,Image, StyleSheet,ScrollView,RefreshControl,Animated} from 'react-native'
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
import { LoadingBookCover, LoadingList, LoadingProfilePhoto,LoadingText } from "../../components/onLoading";


const ClubScreen = ({navigation,route}) => {
    const clubID = route.params.clubID
    const {auth:{user:{token,user_id}},setGroups,setUser,user,stun,setAuth} = useContext(globContext)
    const {info, setInfo} = useContext(clubContext)
    const [ownerName,setOwnerName] = useState('')
    const [isOwner,setIsOwner] = useState(false)
    const [isPart,setIsPart] = useState(false)
    const {navigate} = useNavigation()
    const [refreshing, setRefreshing] = useState(false);
    const [loading,setLoading] = useState(true)


    const fetchClubInfo = async () => {
        try {
            const response = await fetch(`http://${API_SERVER}/group/info/${clubID}/`)
            if(response.status > 400 ) { 
                alert(`Error - ${response.status}`)
                return;
            }
            const data = await response.json()
            data.photoPath = data.photoPath +`?time=${new Date().getTime()}`
            setInfo(data)
            setLoading(false)
        } catch(err){
            alert('Connection error')
        }
    }


    const onRefresh = useCallback( async()=>{
        setRefreshing(true)
        try {
        const response = await fetch(`http://${API_SERVER}/group/info/${clubID}/`)
        if(response.status > 400 ) { 
            alert(`Error - ${response.status}`)
            return;
        }
        const data = await response.json()
        data.photoPath = data.photoPath +`?time=${new Date().getTime()}`
        setInfo(data)
        setRefreshing(false)
        } catch(err){
            alert('Connection error')
        }
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
        try {
        const response = await fetch(`http://${API_SERVER}/group/leave/${clubID}/`,{
            "method": "DELETE",
            "headers" : {
            "Authorization": `Token ${token}`
            }
        })
        if (response.status === 401) throw '401 neautorizovany pouzivatel'
        if ( response.status ===404 || response.status === 409){
            alert('error')
            return;
        }
        const data = await response.json()
        setInfo(data)
        fetchGroups(user_id,setGroups)
        fetchInfo(user_id,setUser)
        }catch(err) {
            alert(`${err}\n\nLogging out`)
            setAuth({type:"LOGOUT"})
        }
    }

    const otherButton = async ()=>{
        try {
        const response = await fetch(`http://${API_SERVER}/group/join/${clubID}/`,{
            "method": "PUT",
            "headers" : {
            "Authorization" : "Token " + token
            }
        })
        if (response.status === 401) throw '401 neautorizovany pouzivatel'
        if ( response.status ===404 || response.status === 409){
            alert(`Error - ${response.status}`)
            return;
        }
        const data = await response.json()
        setInfo(data)
        fetchGroups(user_id,setGroups)
        fetchInfo(user_id,setUser)
    }catch(err) {
        alert(`${err}\n\nLogging out`)
        setAuth({type:"LOGOUT"})
    }
    }

    console.log(info.photoPath)


    const pos = new Animated.Value(0)
    useEffect(()=>{
        Animated.loop(
        Animated.timing(pos,{
            toValue: 1000,
            duration: 3000,
            useNativeDriver: false
        }),{iterations:-1}).start()
    },[])
    const position = pos.interpolate({
        inputRange: [0,500,1000],
        outputRange:[0,2.,0]
    })


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
                {loading ? <LoadingProfilePhoto size={180} position={position} /> : 
                    <ProfileImage source={info.photoPath} size={180}/> }
                {loading ? <LoadingText width={200} height={40} style={styles.clubHeaderName} lines={1}  position={position}/> :
                        <Text style={styles.clubHeaderName}>{info.name}</Text> } 
                <View style = {{flexDirection: "row", justifyContent: "space-evenly", marginLeft: 10, marginRight: 10}}>
                    {loading ? <LoadingText style={styles.clubHeaderOwner} lines={1}  position={position}/> :
                    <Text style={styles.clubHeaderOwner}>No. members: {info.count}</Text> }
                    {loading ? <LoadingText  style={styles.clubHeaderOwner} lines={1}  position={position}/> :
                    <Text style={styles.clubHeaderOwner}>Owner: {ownerName}</Text> }
                </View>
            </View>
            <View>
                <View style={styles.firstSection}>
                    <Text style={styles.header}>About</Text>
                    {loading ? <LoadingText  style={styles.text} lines={5} randomlength={true}  position={position}/> :
                    <Text style={styles.text}>{info.info ? info.info : "About not set"}</Text>}
                    <Text style={styles.header}>Rules</Text>
                    {loading ? <LoadingText  style={styles.text} lines={5}  position={position} randomlength={true}/> :
                    <Text style={styles.text}>{info.rules ? info.rules : "Rules not set"}</Text> }
                </View>
                <View style={styles.secondSection}>
                    <Text style={styles.header}>Book of the week</Text>
                    
                    { loading ? <LoadingBookCover size={150} style={styles.bowImage}  position={position}/> :info.book_of_the_week ? <BookCover 
                                source={info.book_of_the_week.cover}
                                style={styles.bowImage}
                                onPress={()=>{ navigation.navigate('Club_Book',{bookID: info.book_of_the_week.id})}}/> 
                                : <Text style={styles.noBook}>No book of the week</Text>}
                </View>
                <View style={styles.thirdSection}>
                    <Text style={styles.header}>Members</Text>
                    <View style = {{marginRight: 20}}>
                    { loading ? <LoadingList  position={position}/> :
                        <UserList users={info.users} onSelect={(item)=>{navigation.navigate('Club_Member',{user_id:item.id})}} selectArray={[]}/>}
                    </View>
                </View>
                <View style={styles.fourthSection}>
                    {!loading && 
                    <Button onPress={isPart ? (isOwner ? ownerButton : memberButton) : otherButton} title={isPart ? (isOwner ? 'Settings' : 'Leave club') : 'Join Club'} style = {{backgroundColor: "#ee6f68", paddingVertical: 15}}/>
                    }</View>
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
        marginVertical: 10,
        fontSize: 30,
        fontWeight:'900',
        color:'black',
        fontFamily: 'serif'
    },
    clubHeaderOwner : {
        marginVertical: 10,
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