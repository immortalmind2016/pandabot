

const request = require("request");
var qs = require('qs');
const delayarr = require("delay-for-array");
const Block_template=require("../model/Block_template")
const User_attr=require("../model/User_attr")

const {sendplugin} =require("./plugins")
function sendToAll(users,templates,page,i=0){
  
     return new Promise((resolve,reject)=>{
         var batch=[]
         

   //     console.log("TEMPLATES ",templates)

     //  console.log(templates[i])

         if(users.length!=0){
            if(templates[i].message.trim()==""){
                sendplugin(templates[i].type,users,templates[i]).then((data)=>{
                  console.log("DATAAAAAAAAAAAAA ",data)
                    if(data=="condition"){
                       User_attr.find({$and:[{value:templates[i].condition_var},{_id:{$in:users}}]},(err,def_users)=>{
                           Block_template.find({block:templates[i].redirect},(err,temps)=>{
                               sendToAll(def_users,temps,page)
                           })
                       })
                     }
                else if(data=="redirect"){
                   Block_template.find({block:templates[i].redirect},(err,temps)=>{
                       if(temps){
                        sendToAll(users,temps,page)
                       }
                   //    
                   })
                   
                 }else if(data=="typing"){
              //   console.log("TYPING ")
              //     console.log("TYPING 2")
                   sendTyping(users,templates[i].seconds*1000,page).then((data)=>{
                //     console.log("DATA ",data)
                    if(i==templates.length-1){

                    }else{
                        sendToAll(users,templates,page,++i)
    
                    }
                   }).catch((e)=>{
               //      console.log("ERR",e)
                   })
   //console.log("TYPING 3")
                   
                    
                 }
               }).catch((e)=>{
        
               })
               resolve("")
            }else{
              let message=JSON.parse(templates[i].message)

                sendMessage(users,message,page,templates[i].type).then((data)=>{
           
                    if(i==templates.length-1){
                  
                    }else{
                        sendToAll(users,templates,page,++i)
    
                    }
                    resolve("")
                })
               
            }
      /*      for(var x=0;x<users.length;x++){    
 batch.push( {
             "method" : "POST",
             "relative_url"  : "me/messages",
             "body":  qs.stringify({recipient:{'id':users[x].messenger_id},message:message})
         })
     }
  
   request.post("https://graph.facebook.com/v4.1/?access_token="+page.access_token, {
         json:  {batch},
     },(err,resp,body)=>{
         console.log("BODY ",body)
                        resolve(body);
 
            if(i==templates.length-1){
            }else
              sendToAll(users,templates,page,++i)
 
     })
           */
         
           
         }
   

 })
    
    

}
sendTyping=(users,seconds,page)=>{
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
           console.log("BEFORE TYPE : ",type,stringMessage)

    if(type=="generic"){
      stringMessage.attachment.payload.elements= stringMessage.attachment.payload.elements.map((elem)=>{
        if(elem.buttons.length==0){
          delete elem.buttons
        }
      })
    }
    console.log("TYPE : ",type,stringMessage)
        
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



const batching=(users)=>{
    let batch_no=0,
    batches=[]
while(users.length!=0){
  var insideArr=users.splice(0,50)


//delayarr.each(templates,{time:5},(message,index)=>{
  //templates.forEach((message,index)=>{  //})
 batches[batch_no]=insideArr
       batch_no++;
 // })


}
return batches

}



module.exports={
    sendToAll,
    batching
}