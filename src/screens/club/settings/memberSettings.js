
import React,{useContext,useState,useEffect} from "react";
import {View,Text} from 'react-native'
import { clubContext } from "../index";
import Button from "../../../components/button";
import { globContext } from "../../../context/globContext"
import UserList from "../../../components/Userlist"
import SearchBar from "react-native-dynamic-search-bar";
import { getClubInfo, removeMember } from "../../../api_calls/club_calls";
import { styles } from "./style";



const MemberSettings = ({}) => {
    const {info, setInfo,setAuth} = useContext(clubContext)
    const {auth:{user:{token,user_id}}} = useContext(globContext)
    const [removeUserIDs,setRemoveUserIDs] = useState([])
    const [search,setSearch] = useState('')
    const [removing,setRemoving] = useState(false)


    const [filtred,setFiltred] = useState([])
    useEffect(()=>{
        setFiltred(info.users.filter(user=>{ return user.displayName.toLowerCase().includes(search)}))
    },[search])
    const removeMembers = async () => {
        setRemoving(true)
        var newInfo = undefined
        var refetchData = false
        for(let i = 0; i< removeUserIDs.length;i++){
            try{
            const response = await removeMember(token,info.id,removeUserIDs[i])
            if(response.status === 401) {
                setRemoving(false)
                setAuth({type:'LOGOUT'})
                return
            }
            if(response.status === 409){
                console.log('e')
                refetchData=true
                continue;
            }
            if(response.status >= 400) continue;
            refetchData=false
            newInfo = response.body
            }catch(e){
                alert('Network Connection Problems')
            }
        }
        setRemoveUserIDs([])
        if(refetchData){
            console.log("refetching")
            const setter = (info)=>{
                newInfo = info
            } 
            try{
                await getClubInfo(info.id,setter)
            }catch(err){
                console.log('Connection error')
                setRemoving(false)
                return;
            }
        }
        if(newInfo !== undefined){
            setInfo(newInfo)
        }
        setRemoving(false)
    }

    const onSelect = ({id,owner}) => {
        console.log(id)
        setRemoveUserIDs(prev=>{
            if(owner) return [...prev]
            if(prev.includes(id)){
                console.log(prev)
                const index = prev.indexOf(id)
                prev.splice(index,1)
                console.log(prev)
                return [...prev]
            }
            return [...prev,id]
        }
    )}

    return (<View style = {{marginHorizontal: 10}}>
                        <Text style={styles.removeMembers}>Remove Members</Text>
                        <SearchBar 
                            placeholder="Search here"
                            onPress={()=>{console.log("onPress")}}
                            onChangeText={(text) => {setSearch(text)}}
                            onSearchPress={(text) => console.log('searching: ', text)}
                            style={{marginBottom:15}}/>
                        <UserList users={filtred} onSelect={onSelect} selectArray={removeUserIDs}/>
                        <Button title='Remove Members' onPress={removing ? ()=>{} :removeMembers} style={styles.deleteButton} visible={removing}></Button>
            </View>)
}

export default MemberSettings