
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
    SET_BOOK_WEEK,
    REMOVE_MEMBER,
     } from '../constants/offline';
import { joinClub, leaveClub,deleteClub,createClub, changeClub, setBookOfTheWeek, removeMembers, saveUserSettings } from './stateChangers';

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
                syncing : false,
                error : null,
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
        case ADD_BOOK:
            return{
                ...state,
                user_book_profiles : {
                    ...state.user_book_profiles,
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
                member_id : payload?.member_id,
                book_op : payload?.list,
                form : payload?.form, //form data from settings
                data : payload?.data // if data where fetched with online -- must consists of userData and clubInfo
            }
            var editedState = {...state}
            switch(payload.type){
                case JOIN_CLUB:
                    editedState = joinClub(state,operation, payload.offline)
                    break
                case LEAVE_CLUB:
                    editedState = leaveClub(state,operation,payload.offline)
                    break;
                case DELETE_CLUB:
                    editedState = deleteClub(state,operation,payload.offline)
                    break;
                case CREATE_CLUB:
                    editedState = createClub(state,operation,payload.offline)
                    break;
                case SET_BOOK_WEEK:
                    editedState = setBookOfTheWeek(state,operation,payload.offline)
                    break;
                case REMOVE_MEMBER:
                    editedState = removeMembers(state,operation,payload.offline)
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
                    //user settings
                    editedState = saveUserSettings(state,operation,payload.offline)
                    break;
                case SAVE_CLUB:
                    editedState = changeClub(state,operation,payload.offline)
                    break;
                default:
                    return {...state}
            }
           
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