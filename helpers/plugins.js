const Messenger_user=require("../model/Messenger_user")
const User_attr=require("../model/User_attr")

const sendplugin=(type,users,template)=>{
  return new Promise((resolve,reject)=>{
  //  console.log("TYPE ",type)

    switch(type){
        case "input":{
            Messenger_user.find({messenger_id:{$in:users}},(ids)=>{
                User_attr.findOneAndUpdate({_id:{$in:ids}},{last_input:template.attr})
            })
            reject()
        }
        case "redirect":{
            resolve("redirect")
        }
        case "condition":{
            resolve("condition")
        }
        case "typing":{
            resolve("typing")
        }
}
     
  })
  
}

const sendplugin_single=(type,userId,template)=>{
    return new Promise((resolve,reject)=>{
    //  console.log("TYPE ",type)
  
      switch(type){
          case "input":{
              Messenger_user.find({messenger_id:userId},(err,user)=>{
                  User_attr.findOneAndUpdate({_id:user._id},{last_input:template.attr})
              })
              reject()
          }
          case "redirect":{
              resolve("redirect")
          }
          case "condition":{
              resolve("condition")
          }
          case "typing":{
              resolve("typing")
          }
  }
       
    })
    
  }
  
module.exports={
    sendplugin,
    sendplugin_single
}