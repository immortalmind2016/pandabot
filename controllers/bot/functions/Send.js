

//START WELCOME 
let Bot=require("../../../model/Bot")
let Send_template=require("../../../model/Send_template")
let Page=require("../../../model/Page")
let Messenger_user=require("../../../model/Messenger_user")
let {sendToAll,batching} =require("../../../helpers/broadcast")




const createSendTemplate  =async(req,res,err)=>{
    const bot=await Bot.findOne({ $and: [ { _id: req.params.botid }] })
    if (bot) {
        const templateDate=req.body.data
         

             if(templateDate.message!="")    
                templateDate.message=templateDate.message!=""?JSON.stringify(templateDate.message):templateDate.message

                    let template=new Send_template({
                        ...templateDate,
                        bot:bot._id
                    })
                    await template.save()
                    if (template.message)
                        template.message=JSON.parse(template.message)
                      return  res.json({template})
                    
           

  
    }
        res.sendStatus(404)
    

}
const removeSendTemplate =async(req,res,err)=>{

    const doc=await Send_template.findOneAndRemove({$and:[{_id:req.params.templateid},{bot:req.params.botid}]})
    if(!!doc)

      res.sendStatus(200)
  

      

    
    return   res.sendStatus(404)


}
const editSendTemplate =async(req,res,err)=>{
    const templateDate=req.body.data

    if(templateDate.message!="")
       templateDate.message=templateDate.message!=""?JSON.stringify(templateDate.message):templateDate.message

   
         const template= await   Send_template.findOneAndUpdate({ $and: [{ bot: req.params.botid }, { _id: req.params.templateid }] },{...templateDate},{new:true})
               if (template) {
                  return res.json({template})
           
               }
                   res.sendStatus(404)
       
}
const getSendTemplates =async(req,res,err)=>{
    const bot = await Bot.findOne({user_id:req.user._id,_id:req.params.botid})
    if(!bot){
        return res.sendStatus(404)
    }
    const templates = await Send_template.find({bot:bot._id})
        res.json({templates})

}
const startSend =async(req,res,err)=>{
    console.log("START")
    const id=req.params.botid

    const page= await Page.findOne({bot:id})
    if(page){
     console.log("Page found")
        await Bot.deleteOne({bot:req.params.botid})
        const users=await Messenger_user.find({page:page._id})
                  if(users.length>0){
                      const templates= await Send_template.find({bot:id})
                          if(templates.length>0){
                             let messages=[];
                             templates.forEach((template)=>{
                                 messages.push(template)
                             })
                             let batches=batching(users);
                             let counter=0;
                             var index=0;
                                 const sendInterval=setInterval(()=>{
                                    
                                     sendToAll(batches[index],messages,page).then((data)=>{
                           
                                         counter+=batches[index].length;
                                         if(counter%100000==0){
                                             Bot.findOneAndUpdate({_id:id},{last_send_now_numbers:counter});
         
                                         }
                                         if(index==batches.length-1){
                                            Bot.findOneAndUpdate({_id:id},{last_send_now_numbers:counter});
         
                                         }
         
             
                                     })
                                     if(index==batches.length-1){
                                      clearInterval(sendInterval)
                                       }else
                                     index++;
                                 })
                                 return res.sendStatus(200)

         
                          }
                     
                  }
    } 

    res.sendStatus(401)
    
    
}
module.exports={
         
    createSendTemplate,
    removeSendTemplate,
    editSendTemplate,
    getSendTemplates,
    startSend

}