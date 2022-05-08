
import React from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';
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
    CREATE_CLUB,
    DELETE_CLUB,
     } from '../constants/offline';
import { joinClub, leaveClub,deleteClub,createClub } from './stateChangers';

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
                case DELETE_CLUB:
                    var editedState = deleteClub(state,operation,payload.offline)
                    break;
                case CREATE_CLUB:
                    var editedState = createClub(state,operation,payload.offline)
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