import { getClubInfo, joinClub, leaveClub } from "../../api_calls/club_calls"
import { fetchInfo } from "../../api_calls/user_calls"
import { CHANGE_VALUE, JOIN_CLUB, LEAVE_CLUB } from "../reducers/storageReducer"

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