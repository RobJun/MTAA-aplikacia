import { API_SERVER } from "./constants"
const API_CALL = `http://${API_SERVER}`
export const login_call  = async (user_data) => {
        const timeout = 5000
        const controller = new AbortController()
        const id = setTimeout(()=>controller.abort(),timeout)
       
        try {
            let data = await fetch(`${API_CALL}/auth/login/`, {
                    "method": "POST",
                    "headers": {
                    "Content-Type": "application/json"
                    },
                    "body": JSON.stringify(user_data),
                    signal:controller.signal
            })
            clearTimeout(id);
    
            const code = data.status
            if(code === 401){
                return {code : code, body : {}}
            }
            const body = await data.json()
           
            return {code: code, body : body}
        }catch (err) {
           
            throw err;
        }
    }

export const register_call = async (user_data) => {
        const timeout = 5000
        const controller = new AbortController()
        const id = setTimeout(()=>controller.abort(),timeout)
       

        try {
            let data =await fetch(`${API_CALL}/auth/register/`, {
                "method": "POST",
                "headers": {
                "Content-Type": "application/json"
                },
                "body": JSON.stringify(user_data),
                signal:controller.signal
            })
            clearTimeout(id)
            const code = data.status
            if(code == 409 || code == 406){
                return {code: code,body: {}}
            }
            const body = await data.json()
           
            return {code : code, body: body}
        }catch(err){
           
            throw err;
        }
    }

