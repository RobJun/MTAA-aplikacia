import { API_SERVER } from "./constants";
    
export const fetchInfo = (user_id,dispatch) => {
    fetch(`http://${API_SERVER}/user/info/?q=${user_id}`)
    .then(response => response.json())
    .then(data => {
        data.clubs.forEach(element => {
            element.photoPath = element.photoPath +`?time=${new Date().getTime()}`
        });
        dispatch(data)
        
    })
}

export const fetchGroups = (user_id,dispatch) => {
    fetch(`http://${API_SERVER}/user/groups/?q=${user_id}`)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            element.photoPath = element.photoPath +`?time=${new Date().getTime()}`
        });
        dispatch(data)
    })
}

export const fetchBooks = (user_id,dispatch,category) => {
    fetch(`http://${API_SERVER}/user/books/${category}/?q=${user_id}`)
    .then(response => response.json())
    .then(data => dispatch(data))
}