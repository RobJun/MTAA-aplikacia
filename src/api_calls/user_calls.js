import { API_SERVER } from "./constants";

export const fetchInfo = async (user_id,dispatch) => {
    const response = await fetch(`http://${API_SERVER}/user/info/?q=${user_id}`)
    if(response.status === 404) {
        alert("404 User not found")
        return
    }
    const data = await response.json()
    data.clubs.forEach(element => {
        element.photoPath = element.photoPath +`?time=${new Date().getTime()}`
    });
    dispatch(data)
}

export const fetchGroups = async (user_id,dispatch) => {
    const response = await fetch(`http://${API_SERVER}/user/groups/?q=${user_id}`)
    if(response.status === 404) {
        alert("404 User not found")
        return
    }
    const data = await response.json()
    data.forEach(element => {
        element.photoPath = element.photoPath +`?time=${new Date().getTime()}`
    });
    dispatch(data)
}

export const fetchBooks = async (user_id,dispatch,category) => {
    const response = await fetch(`http://${API_SERVER}/user/books/${category}/?q=${user_id}`)
    if(response.status === 404 || response.status === 406) {
        if (response === 404) alert("404 User not found")
        else alert("406 Incorrect list")
        return
    }
    const data = await response.json()
    dispatch(data)
}