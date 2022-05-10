import { panGestureHandlerCustomNativeProps } from 'react-native-gesture-handler/lib/typescript/handlers/PanGestureHandler';
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
       
       
        const ret = {
            ...state,
            userData : operation.data.userData,
            user_club_profiles : {
                ...state.user_club_profiles,
                [operation.club_id] : operation.data.clubInfo
            }
        }
       
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
   
    return {
        ...state,
        userData : operation.data.userData
    }
}

export const setBookOfTheWeek = (state,operation,offline) => {
    if(!offline){
        return {
            ...state,
            user_club_profiles : {
                ...state.user_club_profiles,
                [operation.club_id] : operation.data.clubInfo
            }
        }
    }
    var temp_club = {...state.user_club_profiles[operation.club_id]}
    temp_club = {
        ...temp_club,
        book_of_the_week : state.user_book_profiles[operation.book_id]
    }
    
    return {
        ...state,
        user_club_profiles : {
            ...state.user_club_profiles,
            [operation.club_id] : temp_club
        }
    }
}

export const changeClub  = (state,operation,offline) =>{
   
    if(!offline){

        return {
            ...state,
            userData : operation.data.userData,
            user_club_profiles : {
                ...state.user_club_profiles,
                [operation.club_id] : operation.data.clubInfo
            }
        }
    }
    var temp_club = {...state.user_club_profiles[operation.club_id]}
    var temp_user = {...state.userData}

    operation.form['_parts'].forEach(element => {
        if(element[0] === 'info'){
            temp_club = {
                ...temp_club,
                info : element[1]
            }
        }else if(element[0]==='rules'){
            temp_club = {
                ...temp_club,
                rules : element[1]
            }
        }else if(element[0] === 'photo'){
           
            temp_club = {
                ...temp_club,
                photoPath : element[1].uri
            }
            temp_user = {
                ...temp_user,
                photoPath : element[1].uri
            }
        }
    });
   

    console.log({
        ...state.user_club_profiles,
        [operation.club_id] : temp_club
    })

   

    return {
        ...state,
        userData : temp_user,
        user_club_profiles : {
            ...state.user_club_profiles,
            [operation.club_id] : temp_club
        }
    }
}


export const removeMembers = (state,operation,offline) => {
    if(!offline){
        console.log('hrer')
        return {
            ...state,
            userData : operation.data.userData,
            user_club_profiles : {
                ...state.user_club_profiles,
                [operation.club_id] : operation.data.clubInfo
            }
        }
    }

    // vymazat z clenov
    var temp_user = {...state.userData}
    var index = temp_user.clubs.findIndex(el => el.id === operation.club_id)
    temp_user.clubs[index].number_of_members -= 1


    var temp_club = {...state.user_club_profiles[operation.club_id]}
    var ind = temp_club.users.findIndex(el => el.id === operation.member_id)
    var temp_users = [...temp_club.users]
    if(ind == -1) return;
    temp_users.splice(ind,1)
    temp_club.count -= 1
    temp_club = {
        ...temp_club,
        users : temp_users
    }

    return {
        ...state,
        userData : temp_user,
        user_club_profiles : {
            ...state.user_club_profiles,
            [operation.club_id] : temp_club
        }
    }
}

export const saveUserSettings =  (state,operation,offline) => {
    if(!offline){
        console.log("tu",operation.data.userData)
        return {
            ...state,
            userData : operation.data.userData
        }
    }
    console.log("tu som")
    var temp_user = {...state.userData}
    operation.form['_parts'].forEach(element => {
        if(element[0] === 'photo'){
            temp_user.photoPath = element[1].uri
        }else if(element[0] === 'bio'){
            temp_user.bio =  element[1]
        }
    })


    return {
        ...state,
        userData : temp_user
    }
}


export const putBooks= (state,operation,offline) => {
     if(!offline){
         return {
             ...state,
             userData : operation.data.userData,
             wishlist : operation.data.wishlist,
             reading : operation.data.reading,
             completed : operation.data.completed,
         }
     }
     const lists = ['wishlist','reading','completed']
     const profile = {...state.user_book_profiles[operation.book_id]}
     var temp_user = {...state.userData}
     var temp_recom = [...state.userData.recommended_books]
     var temp_wish = [...state.wishlist]
     var temp_reading = [...state.reading]
     var temp_completed = [...state.completed]
    if(operation.book_op.includes('recommend')){
        if(operation.book_op.includes('un')){
            var index = temp_recom.findIndex(x=> x.id === operation.book_id)
            if(index == -1) return {...state}
            temp_recom.splice(index,1)
        }else{
            temp_recom.push(profile)
        }
    }else{
    //najst knihu v zoznamoch a vymazat
        var i_wish = temp_wish.findIndex(e=>e.id === operation.book_id)
        if(i_wish !== -1){
            temp_wish.splice(i_wish,1)
            temp_user.wishlist-=1;
        }
        var i_read = temp_reading.findIndex(e=>e.id === operation.book_id)
        if(i_read !== -1){
            temp_reading.splice(i_read,1)
            temp_user.currently_reading-=1;
        }
        var i_comp = temp_completed.findIndex(e=>e.id === operation.book_id)
        if(i_comp !== -1){
            temp_completed.splice(i_comp,1)
            temp_user.completed-=1;
        }

        //pridat knihu do zoznamu
        // v userdatach +1 pre pridany -1 pre odbrany
        if(operation.book_op === 'wishlist'){
            temp_wish.push(profile)
            temp_user.wishlist +=1;
        }else if(operation.book_op === 'reading'){
            temp_reading.push(profile)
            temp_user.currently_reading +=1;
        }else if(operation.book_op === 'completed'){
            temp_completed.push(profile)
            temp_user.completed +=1;
        }
    }
    console.log(temp_wish)
    console.log(temp_reading)
    console.log(temp_completed)
     return {
         ...state,
         userData : {
             ...temp_user,
             recommended_books : temp_recom
         },
         wishlist : temp_wish,
         reading : temp_reading,
         completed : temp_completed
     }

}

export const deleteBooks = (state,operation,offline) => {
    if(!offline){
        return {
            ...state,
            userData : operation.data.userData,
            wishlist : operation.data.wishlist,
            reading : operation.data.reading,
            completed : operation.data.completed,
        }
    }
    var temp_user = {...state.userData}
    var temp_wish = [...state.wishlist]
    var temp_reading = [...state.reading]
    var temp_completed = [...state.completed]
   
    var i_wish = temp_wish.findIndex(e=>e.id === operation.book_id)
    if(i_wish !== -1){
        temp_wish.splice(i_wish,1)
        temp_user.wishlist-=1;
    }
    var i_read = temp_reading.findIndex(e=>e.id === operation.book_id)
    if(i_read !== -1){
        temp_reading.splice(i_read,1)
        temp_user.currently_reading-=1;
    }
    var i_comp = temp_completed.findIndex(e=>e.id === operation.book_id)
    if(i_comp !== -1){
        temp_completed.splice(i_comp,1)
        temp_user.completed-=1;
    }

    return {
        ...state,
        userData : {
            ...temp_user,
        },
        wishlist : temp_wish,
        reading : temp_reading,
        completed : temp_completed
    }

}