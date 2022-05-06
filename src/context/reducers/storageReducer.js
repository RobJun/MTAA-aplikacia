
import React from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';

export const userData = {
    userData : {},
    wishlist : [],
    reading : [],
    completed : [],
    user_book_profiles : {},
    user_club_profiles : {},
    
    loaded : false,
    isSynced : true,
    syncing : false,
    error : null,
    callQueue :[]
}

export const queue = []


export const SYNC= 0x01
export const ADD_TO_QUEUE=0x02
export const CHANGE_VALUE = 0x03
export const SYNC_SUCCESS= 0x04
export const LOAD_INITIAL = 0x05
export const LOAD_FROM_MEMORY = 0x06
export const UNSYNC = 0x07
export const SYNC_FAILED = 0x08
export const CLEAR_ERROR = 0x09
export const ADD_CLUB = 0x0a

export const LEAVE_CLUB = 0x10
export const JOIN_CLUB = 0x20
export const ADD_BOOK = 0x30
export const REMOVE_BOOK = 0x40
export const RECOMMEND = 0x50
export const UNRECOMMEND = 0x60
export const SAVE_USER = 0x70
export const SAVE_CLUB = 0x80


const joinClub = (state,operation,offline) =>{  
    //if online just set fetche data
    if(!offline) {
        console.log('here - joinClub',operation.club_id)
        console.log('here - joinClub',operation.data)
        const ret = {
            ...state,
            userData : operation.data.userData,
            user_club_profiles : {
                ...state.user_club_profiles,
                [operation.club_id] : operation.data.clubInfo
            }
        }
        console.log('returnig ',ret)
        return ret
    }
    //check if in state is operation for leaving club
    var temp_callQueue = [...state.callQueue]
    var index = temp_callQueue.findIndex(el=> el.type == LEAVE_CLUB && el.club_id == operation.club_id)
    while(index !== -1){
        temp_callQueue.splice(index,1)
        index = temp_callQueue.findIndex(el=> el.type == LEAVE_CLUB && el.club_id == operation.club_id)
    }

    //add user to club 
    const temp_clubProfile = {
        ...state.user_club_profiles[operation.club_id],
        count : state.user_club_profiles[operation.club_id].count+1,
        users : [...state.user_club_profiles[operation.club_id].users, 
            {
            id : state.userData.id,
            displayName : state.userData.displayName,
            photoPath : state.userData.photoPath,
            owner : false,
            }]
    }

    const temp_clubProfiles = {
        ...state.user_club_profiles,
        [operation.club_id] : temp_clubProfile
    }

    //add club to user

    const temp_userData = {
        ...state.userData,
        clubs : [...state.userData.clubs,{
                id : operation.club_id,
                name : temp_clubProfile.name,
                number_of_members : temp_clubProfile.count,
                photoPath : temp_clubProfile.photoPath,
        }]
    }

    return {
        ...state,
        userData : temp_userData,
        user_club_profiles : temp_clubProfiles,
        callQueue : temp_callQueue
    }
}

const leaveClub = (state,operation, offline) => {
    //if online just set fetche data
    if(!offline) {
        console.log('here - leaveClub', operation.data)
        return {
            ...state,
            userData : operation.data.userData,
            user_club_profiles : {
                ...state.user_club_profiles,
                 [operation.club_id] : operation.data.clubInfo
            }
        }
    }
     //check if in state is operation for joining club
     var temp_callQueue = [...state.callQueue]
     var index = temp_callQueue.findIndex(el=> el.type == JOIN_CLUB && el.club_id == operation.club_id)
     while(index !== -1){
         temp_callQueue.splice(index,1)
         index = temp_callQueue.findIndex(el=> el.type == JOIN_CLUB && el.club_id == operation.club_id)
     }

    //remove user from club profile
    
        //find user in list
    var temp_clubUsers = [...state.user_club_profiles[operation.club_id].users]
    var index_user = temp_clubUsers.findIndex(e => e.id === operation.user_id)
    if(index_user !== -1){
        temp_clubUsers.splice(index_user,1)
    }

    const temp_clubProfile = {
        ...state.user_club_profiles[operation.club_id],
        count : state.user_club_profiles[operation.club_id].count-1,
        users : temp_clubUsers
    }

    const temp_clubProfiles = {
        ...state.user_club_profiles,
        [operation.club_id] : temp_clubProfile
    }

    //remove club from user profile
    var temp_userClubs = [...state.userData.clubs]
    var index_club = temp_userClubs.findIndex(e=>e.id === operation.club_id)
    if(index_user !== -1){
        temp_userClubs.splice(index_club,1)
    }

    const temp_userData = {
        ...state.userData,
        clubs : temp_userClubs
    }

    return {
        ...state,
        userData : temp_userData,
        user_club_profiles : temp_clubProfiles,
        callQueue : temp_callQueue
    }
}

export const syncReducer = (state,{type,payload})=>{
    switch (type){
        case LOAD_INITIAL: //prvotny stav -- ked v pamati nie su data -- nacitaj z internetu
            return {
                ...payload,
                isSynced : true,
                syncing : false,
                error : null,
                callQueue :[],
                loaded : true
            }
        case SYNC:
            //go through all calls in queue
            return;
        case ADD_CLUB:
            console.log('sdasdas',{user_club_profiles : {
                ...state.user_club_profiles,
                [payload.id] : payload
            }})
            return {
                ...state,
                user_club_profiles : {
                    ...state.user_club_profiles,
                    [payload.id] : payload
                }
            }

        case CHANGE_VALUE:
            const operation = {
                type : payload?.type,
                user_id : payload?.user_id,
                token : payload?.token,
                club_id : payload?.club_id,
                book_id : payload?.book_id,
                book_op : payload?.list,
                data : payload?.data // if data where fetched with online -- must consists of userData and clubInfo
            }
            var editedState = {...state}
            switch(payload.type){
                case JOIN_CLUB:
                    var editedState = joinClub(state,operation, payload.offline)
                    break
                case LEAVE_CLUB:
                    var editedState = leaveClub(state,operation,payload.offline)
                    break;
                case ADD_BOOK: 
                    //var editedState = addBook(state,operation)
                    break;
                case REMOVE_BOOK:
                    //var editedState = removeBook(state,operation)
                    break;
                case RECOMMEND: 
                    //var editedState = recommendBook(state,operation)
                    break;
                case UNRECOMMEND:
                    //var editedState = unrecommendBook(state,operation)
                    break;
                case SAVE_USER: 
                    break;
                case SAVE_CLUB:
                    break;
                default:
                    return {...state}
            }
            console.log('state-',editedState.user_club_profiles)
            return{
                ...editedState,
                isSynced: !payload.offline,
                callQueue : payload.offline ? [...editedState.callQueue,operation] : [...editedState.callQueue]
            }
        case SYNC_SUCCESS:
            return {...state,
                callQueue : [],
                syncing : false,
                isSynced : true,
                error : null
            };
        case SYNC_FAILED:
            return {
                ...state,
                syncing : false,
                isSynced : false,
                error : "SYNC FAILED",
                callQueue : payload.callQueue
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error : null
            }
        case LOAD_FROM_MEMORY:
            console.log(LOAD_FROM_MEMORY,payload)
            return payload
        case ERROR:
            return {
                ...state,
                error : payload
            }
        default:
            return state;
    }
}