const axios=require("axios")
let Page=require("../../../model/Page")
let Block=require("../../../model/Block")
let Ai=require("../../../model/Ai")
let Block_template=require("../../../model/Block_template")
const {sendplugin_single} =require("../../../helpers/plugins")
let Welcome_template=require("../../../model/Welcome_template")
let Messenger_user=require("../../../model/Messenger_user")

const subscribeApp=(pageId,accessToken)=>{
axios.post("https://graph.facebook.com/v3.3/"+pageId+"/subscribed_apps?access_token="+accessToken,{
    subscribed_fields:["messages","standby","messaging_postbacks"]
})
.then(response=>{
    console.log(response.data)
}).catch((e)=>{
    console.log("ERROR ",e)
})
}
const sendTyping_single=(senderId,seconds,accessToken)=>{
    return new Promise((resolve,reject)=>{
        
        axios.post("https://graph.facebook.com/v3.3/me/messages?access_token="+accessToken,{
            recipient:{
                id:senderId
            },
          sender_action:"typing_on"
        }).then((response)=>{
            console.log(response.data)
        setTimeout(()=>{

            axios.post("https://graph.facebook.com/v3.3/me/messages?access_token="+accessToken,{
                recipient:{
                    id:senderId
                },
              sender_action:"typing_off"
            }).then((response)=>{
                console.log(response.data)
                resolve()
            })

          },seconds*1000)
        }).catch((e)=>{
            console.log(e)
        })
    })
}
const sendMessage=(senderId,accessToken,templates,i=0)=>{
    //console.log(templates)
    //console.log(templates[i],"TEMPLATE")
        if(i==templates.length){
            return 
        }
        if(templates[i].message==""){
            sendplugin_single(templates[i].type,senderId,templates[i]).then((data)=>{
                    console.log("DATA ",data)
                    switch(data){
                        case "typing":{
                            sendTyping_single(senderId,templates[i].seconds,accessToken).then(()=>{
                                sendMessage(senderId,accessToken,templates,++i)

                            }).catch(()=>{
                                sendMessage(senderId,accessToken,templates,++i)

                            })
                        }
                        case "redirect":{
                            Block_template.find({block:templates[i].redirect},(err,temps)=>{
                                console.log(temps , "TEMPSSS")
                                sendMessage(senderId,accessToken,temps)

                            })
                        }
                    }

            })

        }else{
            var vars=["first_name","last_name"]
            const pattern=/\{[A-z0-9]*\}/i
              console.log("MESSAGE ",templates[i].message)
                if(templates[i].message.match(pattern)){

                  
            Messenger_user.findOne({messenger_id:senderId},(err,user)=>{
                console.log("IFFFF ",user , typeof(templates[i].message))
                let message=templates[i].message
                if(!!templates[i].message){
                    for(var v=0;v<vars.length;v++){

                       message=message.replace("{"+vars[v]+"}",user[vars[v]])

                     }
              
                   }
           console.log("************************")

                   axios.post("https://graph.facebook.com/v3.3/me/messages?access_token="+accessToken,{
                    recipient:{
                        id:senderId
                    },
                        message:JSON.parse(message)
                }).then((response)=>{
                 //   console.log(response.data)
                     sendMessage(senderId,accessToken,templates,++i)
                }).catch((e)=>{
                //    console.log(e.response)
            
                     sendMessage(senderId,accessToken,templates,++i)
            
                })
               
            })
                     }

            else{
                console.log("ELSEEE")
                axios.post("https://graph.facebook.com/v3.3/me/messages?access_token="+accessToken,{
                    recipient:{
                        id:senderId
                    },
                        message:JSON.parse(templates[i].message)
                }).then((response)=>{
                 //   console.log(response.data)
                     sendMessage(senderId,accessToken,templates,++i)
                }).catch((e)=>{
                //    console.log(e.response)
            
                     sendMessage(senderId,accessToken,templates,++i)
            
                })
            }
                
        
    }
  

    
}
responseToPostback=(pageId,senderId,title,botId)=>{
    console.log(pageId)
    Page.findOne({$and:[{page_id:pageId},{bot:botId}]},(err,page)=>{
        if(!!page){
            switch(title){
                case "<GET_STARTED_PAYLOAD>" :{
                    console.log(page)
                    Welcome_template.find({bot:page.bot},(err,templates)=>{
                 //       console.log("TEMPLATES" ,templates)
                        sendMessage(senderId,page.access_token,templates)

                    })
                }
                default :{
                    console.log("TITLE ",title)
                    Block.findOne({$and:[{_id:title},{bot:botId}]},(err,block)=>{
                        if(!!block)
                        Block_template.find({block:block._id},(err,templates)=>{
                            sendMessage(senderId,page.access_token,templates)
        
                        })
                    })
                }
            }
           /*
            })*/
            
    
            
        }
    }).populate("bot_id")
   
}
responseAi=(pageId,senderId,message)=>{
    console.log(pageId)
    Page.findOne({page_id:pageId},(err,page)=>{
        if(!!page){
           Ai.find({bot:page.bot},(err,ais)=>{
               let sent=false;
               console.log(ais,"////",message)
               ais.forEach((ai)=>{
                   const questions=ai.messages.split(",");
                 
                   questions.forEach((q)=>{
                       if(message.trim().includes(q.trim())){
                        if(sent!=true)
                        {
                            console.log("TRUEEE  ",[{message:`[{"text":"${ai.replay}"]`}])
                            if(ai.type=="text"){
                                sendMessage(senderId,page.access_token,[{message:`{"text":"${ai.replay}"}`}])
                                sent=true;
                            }else if (ai.type=="block"){
                                console.log("AI TPE BLOCK")
                                Block_template.findOne({block:ai.payload},(err,templates)=>{
                                    console.log("AI TPE BLOCK" ,templates)

                                    sendMessage(senderId,page.access_token,templates)

                                })
                            }
                          
                        }
                       }
                   })
               })
             

           })
            
        }
    }).populate("bot_id")
   
}
module.exports={
    subscribeApp,
    responseToPostback,
    responseAi
}