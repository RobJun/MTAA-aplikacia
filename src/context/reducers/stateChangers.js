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
    SAVE_CLUB   ,
     } from '../constants/offline';


export const joinClub = (state,operation,offline) =>{  
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

export const leaveClub = (state,operation, offline) => {
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


export const deleteClub = (state,operation, offline)=>{
    var temp_object = {}
    for(const id in state.user_club_profiles){
        if(id === operation.club_id) {
            console.log('deleted --',id)
            continue;
        }
        temp_object = {
            ...temp_object,
            [id] : state.user_club_profiles[id]
        }
    }

    if(!offline){
        return {
            ...state,
            userData : operation.data.userData,
            user_club_profiles : temp_object
        }
    }


    var temp_clubs = [...state.userData.clubs]
    const index = temp_clubs.findIndex(x=> x.id === operation.club_id)
    temp_clubs.splice(index,1)

    return {
        ...state,
        userData : {
            ...state.userData,
            clubs : temp_clubs
        },
        user_club_profiles : temp_object
    }
}



export const createClub = (state,operation) =>{
    console.log('creating -- ',operation.data.userData)
    return {
        ...state,
        userData : operation.data.userData
    }
}