import { API_SERVER } from "./constants";

export const fetchInfo = async (user_id,dispatch) => {
    try {
        const response = await fetch(`http://${API_SERVER}/user/info/?q=${user_id}`)
        if(response.status === 404) {
            alert("Error 404 - User not found")
            return;
        }
        const data = await response.json()
        data.clubs.forEach(element => {
            element.photoPath = element.photoPath +`?time=${new Date().getTime()}`
        });
        dispatch(data)
        return data
    } catch(err) {
        alert("Error - No internet connection")
        throw err
    }
}

export const fetchGroups = async (user_id,dispatch) => {
    try {
        const response = await fetch(`http://${API_SERVER}/user/groups/?q=${user_id}`)
        if(response.status === 404) {
            alert("Error 404 - User not found")
            return;
        }
    
        const data = await response.json()
        data.forEach(element => {
            element.photoPath = element.photoPath +`?time=${new Date().getTime()}`
        });
        dispatch(data)
    } catch {
        alert("Error - No internet connection")
        throw err
    }
}

export const fetchBooks = async (user_id,dispatch,category) => {
    try {
        const response = await fetch(`http://${API_SERVER}/user/books/${category}/?q=${user_id}`)
        if(response.status === 404 || response.status === 406) {
            if (response === 404) alert("Error 404 - User not found")
            else alert("Error 406 - Incorrect list")
            return;
        }
        const data = await response.json()
        dispatch(data)
        return data
    } catch {
        alert("Error - No internet connection")
        throw err
    }
    
}

export const saveUserChanges = async (token,form) => {
    console.log(form["_parts"][0][0],form["_parts"][1])
    var newForm = new FormData()
    form["_parts"].forEach(element => {
        newForm.append(element[0],element[1])
    });
    try {
    const response = await fetch(`http://${API_SERVER}/user/modify/`,{
        "method": "PUT",
        "headers" : {
            "Content-Type": "multipart/form-data; boundary=---011000010111000001101001",
            "Authorization" : `Token ${token}`
        },
        body: newForm
    })

    if (response.status === 401 || response.status === 404){
        if(response.status === 401) throw('Error 401 - Neatorizovaný používateľ')
        else if(response.status === 404) throw('Error 404 - Prázdne pole DisplayName alebo fotka nie je podporovaný obrázok')
    }

    const body = await response.json()
    body.photoPath = body.photoPath +`?time=${new Date().getTime()}`
    return body
    } catch (err) {
        throw err
    }
}

export const putBook = async (book_id,list,token) =>{
    try { 
        const response = await fetch(`http://${API_SERVER}/user/book/${book_id}/?q=${list}`,{
                        "method": "PUT",
                        "headers" : { "Authorization" : "Token " + token}
        })
        if (response.status === 401 || response.status === 404 || response.status === 406) {
            if(response.status === 401) throw('401 Neutorizovaný používateľ')
            else if(response.status === 404) throw('Error 404 - Neexistujúca kniha')
            else if(response.status === 406) throw('Erro 406 - Neplatný príkaz - zlá kategória')
            return;
        }
        if(response.status == 409) throw 409;

        const data = await response.json()
        return data
    } catch (err) {
            throw err;
    } 
}

export const deleteBook = async (book_id,token) =>{ 
    try { 
        const response = await fetch(`http://${API_SERVER}/user/book/${book_id}/`,{
            "method": "DELETE",
            "headers" : { "Authorization" : "Token " + token }
        })
        if (response.status === 401 || response.status === 404) {
            if(response.status === 401)  throw ('Error 401 - Neutorizovaný používateľ')
            else if(response.status === 404) throw('Error 404 - Neexistujúca kniha')
        }
        if(response.status == 409) throw 409;

        const data = await response.json()
        return data
    } catch (err) {
        throw err
    } 

}