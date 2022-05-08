import { deleteGroup, getClubInfo, joinClub, leaveClub, saveChanges } from "../../api_calls/club_calls"
import { fetchInfo } from "../../api_calls/user_calls"
import { SYNC,            
    ADD_TO_QUEUE    ,
    CHANGE_VALUE   , 
    SYNC_SUCCESS   , 
    LOAD_INITIAL   , 
    LOAD_FROM_MEMORY,
    UNSYNC        ,  
    SYNC_FAILED    , 
    CLEAR_ERROR    , 
    ADD_CLUB     ,   
    LEAVE_CLUB    ,  
    JOIN_CLUB    ,   
    ADD_BOOK    ,    
    REMOVE_BOOK ,    
    RECOMMEND   ,    
    UNRECOMMEND ,    
    SAVE_USER   ,    
    SAVE_CLUB,   
    DELETE_CLUB,
    CREATE_CLUB,
     } from '../constants/offline';

/*
    Tu vkladat funckie v podobnom tvare ako join a leave
    definovat offline spravanie - iba vlozit udaje do dispatck ako je v ifoch if(offline)

    definovat online spravenie pre dispatch - najprv treba urobit fetchna endpoint


*/

export const join_club = async (club_id,token,user_id, offline,dispatch) =>{
    if(offline){
        dispatch({
            type : CHANGE_VALUE, 
            payload : {
                type : JOIN_CLUB,
                club_id : club_id,
                token : token,
                user_id : user_id,
                offline : true
            }
        })
    }else{
        club = await joinClub(club_id,(data)=>{},token)
        console.log('online', club)
        if(club === undefined) return;
        const userData = await fetchInfo(user_id, (data)=>{})
        dispatch({
            type : CHANGE_VALUE,
            payload : {
                type : JOIN_CLUB,
                offline : false,
                club_id : club_id,
                data : {
                    userData : userData,
                    clubInfo : club
                }
            }
        })
    }
}

export const create_club = async (data,token,user_id,dispatch = (op) =>{},getClub_id) => {
    const val = await saveChanges(null,data,token,getClub_id,(ddd)=>{},true)
    if(val === undefined) return false;
    const userData = await fetchInfo(user_id, (data)=>{})
    console.log(userData)
    dispatch({
        type : CHANGE_VALUE, 
        payload : {
            type : CREATE_CLUB,
            data : {
                userData : userData
            }
        }
    })
    return true;
}

export const leave_club = async (club_id,token,user_id, offline,dispatch = (op) =>{}) =>{
    if(offline){
        dispatch({
            type : CHANGE_VALUE, 
            payload : {
            type : LEAVE_CLUB,
            club_id : club_id,
            token : token,
            user_id : user_id,
            offline : true
        }})
    }else{
        club = await leaveClub(club_id,(data)=>{},token)
        console.log('online', club)
        if(club === undefined) return;
        const userData = await fetchInfo(user_id, (data)=>{})
        dispatch({
            type : CHANGE_VALUE,
            payload : {
                type : LEAVE_CLUB,
                offline : false,
                club_id : club_id,
                data : {
                    userData : userData,
                    clubInfo : club
                }
            }
        })

    }
}

export const delete_club = async (club_id,token,user_id, offline,dispatch = (op) =>{}) =>{
    if(offline){
        dispatch({
            type : CHANGE_VALUE, 
            payload : {
            type : DELETE_CLUB,
            club_id : club_id,
            token : token,
            user_id : user_id,
            offline : true
        }})
    }else{
        try{
        await deleteGroup(club_id,token)
        }catch(err){
            console.log('crashed here')
            return 0xff
        }
        const userData = await fetchInfo(user_id, (data)=>{})
        dispatch({
            type : CHANGE_VALUE,
            payload : {
                type : DELETE_CLUB,
                offline : false,
                club_id : club_id,
                data : {
                    userData : userData,
                }
            }
        })

    }
    return true;
}