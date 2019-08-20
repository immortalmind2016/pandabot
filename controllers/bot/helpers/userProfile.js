
const axios=require("axios")
const getUserData=(userId,token)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`https://graph.facebook.com/${userId}?fields=first_name,last_name&access_token=${token}`).then((response)=>{
            resolve(response.data)
        }).catch((e)=>{
            reject(e)
        })
    })
}
module.exports={
    getUserData
}