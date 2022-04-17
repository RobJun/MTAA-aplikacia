const charSet = 'a-zA-Z0-9!@#$%^&_'
export const CHARSET_ERROR = `You can only use ${charSet}`
export const SPACES = 'Name cant be made of spaces'
export const REQUIRED = 'Required field'
export const MIN = (count) => {return `must be atleast ${count} characters long`}
export const MAX = (count) => {return `max ${count} characters`}



export const onlySpaces = (str) => {
    return /^\s*$/.test(str)
}


export const consistsOfCharacters = (str)=>{
    return /^[a-zA-Z0-9!@#$%^&_]*$/.test(str)
}