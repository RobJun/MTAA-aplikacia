
import React from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';

export const userData = {
    userData : {},
    wishlist : [],
    reading : [],
    completed : [],
    user_book_profiles : {},
    user_club_profiles : {},
    
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

export const syncReducer = (state,{type,payload})=>{
    switch (type){
        case LOAD_INITIAL: //prvotny stav -- ked v pamati nie su data -- nacitaj z internetu
            EncryptedStorage.setItem('user_data',JSON.stringify({
                ...payload,
                isSynced : true,
                syncing : false,
                error : null,
                callQueue : []
            }, function replacer(key, value) { return value}))
            return {
                ...payload,
                isSynced : true,
                syncing : false,
                error : null,
                callQueue : []
            }
        case SYNC:
            //go through all calls in queue
            return;
        case CHANGE_VALUE:
            //ulozenie dát
            //ak ma internet tak to poslat tam
            //ak nie tak to dat do callQueue
            return{
                ...state,
                isSynced : false,
            }
        case ADD_TO_QUEUE:
            return{
                ...state,
                callQueue : [...state.callQueue,payload]
            }
        case SYNC_SUCCESS:
            return {...state,
                callQueue : {},
                syncing : false,
                isSynced : true,
                error : null
            };
        case SYNC_FAILED:
            return {
                ...state,
                syncing : false,
                isSynced : false,
                error : "SYNC FAILED"
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
        case UNSYNC: //mozno nepotrebny
            return state
        default:
            return state;
    }
}