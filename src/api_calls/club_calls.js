import { API_SERVER } from "./constants";

export const getClubInfo =  async (clubID,dispatch,load_dispatch = null)=>{
    try {
        const response = await fetch(`http://${API_SERVER}/group/info/${clubID}/`)
        if(response.status > 400 ) { 
            alert(`Error - ${response.status}`)
            return;
        }
        const data = await response.json()
        data.photoPath = data.photoPath +`?time=${new Date().getTime()}`
        dispatch(data)
        if(load_dispatch !== null)
            load_dispatch(false)
        return data
    } catch(err){
       throw err
    }
}

export const leaveClub = async (clubID,dispatch,token)=>{
   
    try {
        const response = await fetch(`http://${API_SERVER}/group/leave/${clubID}/`,{
            "method": "DELETE",
            "headers" : {
            "Authorization": `Token ${token}`
            }
        })
        if (response.status === 401) throw '401 neautorizovany pouzivatel'
        if ( response.status ===404 || response.status === 409){
            alert('error')
            return;
        }
        const data = await response.json()
        data.photoPath = data.photoPath +`?time=${new Date().getTime()}`
        dispatch(data)
        return data
    }catch(err) {
        throw err
    }
}

export const joinClub = async (clubID,dispatch,token) => {
    try {
        const response = await fetch(`http://${API_SERVER}/group/join/${clubID}/`,{
            "method": "PUT",
            "headers" : {
            "Authorization" : "Token " + token
            }
        })
        if (response.status === 401) throw '401 neautorizovany pouzivatel'
        if ( response.status ===404 || response.status === 409){
            alert(`Error - ${response.status}`)
            return;
        }
        const data = await response.json()
        dispatch(data)
        return data;
    }catch(err) {
        throw err
    }
}

export const saveChanges = async (clubID=null,form,token,dispatch, load_dispatch = (bool)=>{}, create= false) => {
    console.log(form["_parts"][0][0],form["_parts"][1])
    var newForm = new FormData()
    form["_parts"].forEach(element => {
        newForm.append(element[0],element[1])
    });
    try{
        let response
        if(create){
            response = await fetch(`http://${API_SERVER}/group/create/`,{
            "method": "POST",
            "headers" : {
                "Content-Type": "multipart/form-data; boundary=---011000010111000001101001",
                "Authorization" : `Token ${token}`
            },
            body: newForm
            })
        }else{
            response = await fetch(`http://${API_SERVER}/group/modify/${clubID}/`,{
                "method": "PUT",
                "headers" : {
                    "Content-Type": "multipart/form-data; boundary=---011000010111000001101001",
                    "Authorization" : `Token ${token}`
                },
                body: newForm
            })
        }
        console.log(response)

        if(response.status === 401) throw '401 neautorizovany pouzivatel'

        if(response.status === 409){
            load_dispatch(false)
            throw "Name already in use"
        }
        if (response.status === 406){
            load_dispatch(false)
            throw "Not right name"
        }
        const body = await response.json()
       
        body.photoPath = body.photoPath +`?time=${new Date().getTime()}`
        dispatch(body)
        return body
        } catch(err){
            throw err;
        }
}

export const deleteGroup = async (clubID,token) => {
    try {
        const response = await fetch(`http://${API_SERVER}/group/delete/${clubID}/`, {
            "method": "DELETE",
            "headers": {
              "Authorization": `Token ${token}`
            }
          }
          )
        if(response.status === 401) throw '401 -- unauthorized to delete Group'
        if(response.status > 400) {
            throw false
        }  
        return true
    } catch(err) {
        throw err
    }
}

export const removeMember = async (token,clubID,userID)=>{
    try{
        const response = await fetch(`http://${API_SERVER}/group/remove/${clubID}/?q=${userID}`,{
            "method" : "DELETE",
            "headers" : {
            "Authorization" : `Token ${token}`
            }
        })
        if(response.status >= 400)  return({status : response.status, body : {}})
        body = await response.json()
        body.photoPath = body.photoPath +`?time=${new Date().getTime()}`
        return {status : response.status, body : body}
        }catch(e){
            throw e
        }
}

export const setBook = async (club_id,book_id,token)=>{
    var resposne ={}
    try{
        resposne = await fetch(`http://${API_SERVER}/group/book/${club_id}/?q=${book_id}`, {
        "method": "PUT",
        "headers": {
          "Authorization": `Token ${token}`
        }
    })
    }catch(err) {
        throw err
    }
    if(resposne.status > 400){
        throw resposne.status
    }
    return await resposne.json()
}