import { elementsThatOverlapOffsets } from "react-native/Libraries/Lists/VirtualizeUtils";
import { deleteGroup, getClubInfo, joinClub, leaveClub, saveChanges, setBook ,removeMember} from "../../api_calls/club_calls"
import { API_SERVER } from "../../api_calls/constants";
import { fetchInfo, saveUserChanges } from "../../api_calls/user_calls"
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
    SET_BOOK_WEEK,
    REMOVE_MEMBER,
     } from '../constants/offline';
import { userData } from "../reducers/storageReducer";

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
    try {
    const val = await saveChanges(null,data,token,getClub_id,(ddd)=>{},true)
    } catch(err){
        throw err
    }
    if(val === undefined) return false;
    const userData = await fetchInfo(user_id, (data)=>{})
   
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

export const save_club_changes = async (club_id, data,token,user_id,offline,dispatch = ({type,payload}) =>{}) => {
    if(offline) {
        dispatch({
            type: CHANGE_VALUE,
            payload : {
                type : SAVE_CLUB,
                club_id : club_id,
                token : token,
                form : data,
                user_id : user_id,
                offline : true
            }
        })
    }else{
       
        var club_profile = {}
        try {
            club_profile = await saveChanges(club_id,data,token,(data)=>{})
           
        } catch(err) {
            console.warn('crashed here')
            throw err
        }
        const user_data = await fetchInfo(user_id,(data)=>{})
       
        dispatch({
            type : CHANGE_VALUE,
            payload : {
                type : SAVE_CLUB,
                club_id : club_id,
                offline : false,
                data : {
                    userData : user_data,
                    clubInfo : club_profile
                }
            }
        })
    }
}

export const set_book_of_week = async (club_id,book_id,token,offline,dispatch  = ({type,payload}) =>{}) =>{
    if(offline){
        dispatch({
            type : CHANGE_VALUE,
            payload : {
                type: SET_BOOK_WEEK,
                club_id : club_id,
                book_id : book_id,
                offline : true,
                token : token
            }
        })
    }else{
        var data = {}
        try{
            data = await setBook(club_id,book_id,token)
        }catch(err) {
            throw err
        }
        dispatch({
            type : CHANGE_VALUE,
            payload : {
                type: SET_BOOK_WEEK,
                club_id : club_id,
                offline : false,
                data : {
                    clubInfo : data
                }
            }
        })
    }
}

export const remove_member = async (club_id,member_id,user_id,token, offline, dispatch = ({type,payload}) =>{}) => {
    if(offline){
        dispatch({
            type : CHANGE_VALUE,
            payload : {
                type: REMOVE_MEMBER,
                offline: true,
                club_id : club_id,
                member_id : member_id,
                user_id : user_id,
                token : token
            }
        })
    }else{
        var data = {}
        try {
            data = await removeMember(token,club_id,member_id)
        }catch(err){
            if(err === 409)
                data = await getClubInfo(club_id,(gg)=>{})
        }
        const user_data = await fetchInfo(user_id,(data)=>{})
        console.log('removed', data)
        dispatch({
            type : CHANGE_VALUE,
            payload : {
                type: REMOVE_MEMBER,
                offline: false,
                club_id : club_id,
                data : {
                    clubInfo : data,
                    userData : user_data
                }
            }
        })
    }
}

export const save_settings = async (form,token, offline,dispatch= ({type,payload}) =>{}) =>{
    if(offline){
        dispatch({
            type: CHANGE_VALUE,
            payload : {
                type : SAVE_USER,
                form : form,
                token : token,
                offline : true
            }
        })
    }else{
        const user_data = await saveUserChanges(token,form)
        console.log('got them',user_data)
        dispatch({
            type : CHANGE_VALUE,
            payload : {
                type : SAVE_USER,
                offline : false,
                data : {
                    userData : user_data
                }
            }
        })
    }
}