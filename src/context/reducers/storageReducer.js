
import React from 'react'

export const userData = {
    userData : {},
    booklists : {
        wishlist : {},
        reading : {},
        completed : {},
        recommended : {}
    },
    clubs : {},
    books : {},
    searchclubs : {},
    
    isSynced : true,
    syncing : false,
    error : null,
    callQueue :[]
}

export const queue = []


export const SYNC= 0x01
export const ADDED_TO_QUEUE=0x02
export const CHANGE_VALUE = 0x03
export const SYNC_SUCCESS= 0x04
export const LOAD_INITIAL = 0x05
export const LOAD_FROM_MEMORY = 0x06
export const UNSYNC = 0x07

export const syncReducer = (state,{type,payload})=>{
    switch (type){
        case LOAD_INITIAL: //prvotny stav -- ked v pamati nie su data -- nacitaj z internetu
            return payload
        case SYNC:
            //go through all calls in queue
            return;
        case CHANGE_VALUE:
            //ulozenie dát
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
            //nacitanie
            return {
                // nacitany state
            }
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