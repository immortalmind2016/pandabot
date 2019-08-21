
let {responseToPostback}=require("../../bot/helpers/pageProfile")
let Messenger_user=require("../../../model/Messenger_user")
let {getUserData}=require("../helpers/userProfile")
let Page=require("../../../model/Page")
let Bot=require("../../../model/Bot")

const webhook=(req,res,err)=>{
    const entry=req.body.entry[0]
   

    if(req.body.object=="page"){
    const messaging=entry.messaging;
    messaging.forEach(message => {
     const senderId=message.sender.id;
     const recipientId=message.recipient.id;
    // console.log(message)
    // console.log(recipientId,"REC")
     Messenger_user.findOne({messenger_id:senderId},(err,user)=>{
         //console.log("USER ",user)
       if(user){

        if(!!message.postback){
            const postback=message.postback;
            const title=message.postback.payload;
            responseToPostback(recipientId,senderId,title)
        }
        else{
            responseAi(recipientId,senderId,message.message.text)
   
        }
       }else{
        Page.findOne({page_id:recipientId},(err,page)=>{
            //    console.log("page ",page)
                  
                if(!user&&page&&page.page_id==recipientId){
                    if(page.bot)
                    Bot.findOne({_id:page.bot},(err,bot)=>{
                        Messenger_user.count({page:page._id},(err,number)=>{
                            console.log("NUMBER ",number," sssssssssssssss ",bot.max_number)
                            if(number>=bot.max_number){
                                
                            }else{
                                getUserData(senderId,page.access_token).then((data)=>{
                                    new Messenger_user({
                                        messenger_id:senderId,
                                        page:page._id,
                                        last_name:data.last_name,
                                        first_name:data.first_name
                                    }).save(()=>{
                                        
                                    if(!!message.postback){
                                        const postback=message.postback;
                                        const title=message.postback.payload;
                                        responseToPostback(recipientId,senderId,title)
                                    }
                                    else{
                                        responseAi(recipientId,senderId,message.message.text)
                            
                                    }
                                    }) 
                                })
                            }
                        })
                       
                    })
              
           
                }
             })
       }
       
     })
  
    });
    }
    res.sendStatus(200)
}

module.exports={
    webhook
}