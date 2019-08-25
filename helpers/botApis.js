
const promisify=require("util").promisify
const request=require("request")
var qs = require('qs');
sendTyping=async(users,seconds,page)=>{
    return new Promise((resolve,reject)=>{
        var batch=[]
       // console.log("INSIDE SEND TYPING")
        for(var x=0;x<users.length;x++){    
            batch.push( {
                        "method" : "POST",
                        "relative_url"  : "me/messages",
                        "body":  qs.stringify({recipient:{'id':users[x].messenger_id},sender_action:"typing_on"})
                    })
                }
              request.post("https://graph.facebook.com/v4.1/?access_token="+page.access_token, {
                    json:  {batch},
                },(err,resp,body)=>{
            //      console.log(body ,"BODY")
                    setTimeout(()=>{
                      for(var x=0;x<users.length;x++){    
                        batch=[]
                        batch.push( {
                                    "method" : "POST",
                                    "relative_url"  : "me/messages",
                                    "body":  qs.stringify({recipient:{'id':users[x].messenger_id},sender_action:"typing_off"})
                                })
                            }
                            request.post("https://graph.facebook.com/v4.1/?access_token="+page.access_token, {
                              json:  {batch},
                          },(err,resp,body)=>{
                            console.log(body)
                            resolve(body)
  
  
                          })
                    },seconds)
  
                 
                })
    })
  
  }
  
  sendMessage=(users,message,page,type)=>{
      return new Promise((resolve,reject)=>{
          var batch=[]
          var vars=["first_name","last_name"]
  
            for(var x=0;x<users.length;x++){
             /* if(!!message){
                var vars=["first_name","last_name"]
                const pattern=/\{[A-z0-9]*\}/gi
                let stringMessage=JSON.stringify(message)
                  let result=stringMessage.match(pattern)
                if(result){
                  result.forEach((r,index)=>{
                    let location=vars.map((v)=>"{"+v+"}").indexOf(result[index])
                    if(location>-1){
                      stringMessage=stringMessage.replace(result[index],users[x][vars[location]])
                    }
             
                })
                message=JSON.parse(stringMessage)
            
                }
                console.log("XXXXXXXXXXXXXXX ",x)
  
              }
              */
             let stringMessage=JSON.stringify(message)
  
             if(!!message){
              for(var i=0;i<vars.length;i++){
                stringMessage=stringMessage.replace("{"+vars[i]+"}",users[x][vars[i]])
  
               }
        
             }
        /*     User_attr.find({user:users[x]._id},(err,attrs)=>{
              for(var i=0;i<attrs.length;i++){
                stringMessage=stringMessage.replace("{"+attrs[i].name+"}",users[x][attrs[i].value])
  
               }
               
             })
             */
             stringMessage=JSON.parse(stringMessage)
             console.log("BEFORE TYPE : ",type,stringMessage)
   /* Handle Buttons inside Generic template */
   if(type=="generic"){
    stringMessage.attachment.payload.elements= stringMessage.attachment.payload.elements.map((elem)=>{
    console.log("ELEM ",elem)
      if(elem.buttons.length==0){
        console.log("ZERO ")
  
        delete elem.buttons
        
        
      }
      return elem
    })
    console.log("TYPE : ",type,stringMessage.attachment.payload.elements)
  
  }
  /* END Handle  Buttons inside Generic template */
      
          
           console.log(stringMessage)
              batch.push( {
                "method" : "POST",
                "relative_url"  : "me/messages",
                "body":  qs.stringify({recipient:{'id':users[x].messenger_id},message:stringMessage})
               })
              
               
              
              }
              
                request.post("https://graph.facebook.com/v4.1/?access_token="+page.access_token, {
                      json:  {batch},
                  },(err,resp,body)=>{
                  //  console.log("BODY ",body)
                      resolve(body)
                  })
      })
  
  }
  
  

  
  module.exports={
      sendMessage,
      sendTyping
  }