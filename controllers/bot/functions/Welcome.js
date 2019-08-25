
//START WELCOME 
let Bot=require("../../../model/Bot")
let Welcome_template=require("../../../model/Welcome_template")


     
const createWelcomeTemplate =async(req,res,err)=>{
    const bot=await Bot.findOne({ $and: [ { _id: req.params.botid }] })
        if (bot) {
            const templateDate=req.body.data
             
            console.log(templateDate)

                 if(templateDate.message!="")    
                    templateDate.message=templateDate.message!=""?JSON.stringify(templateDate.message):templateDate.message

                        let template=new Welcome_template({
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
const removeWelcomeTemplate = async(req,res,err)=>{


                  const doc=await Welcome_template.findOneAndRemove({$and:[{_id:req.params.templateid},{bot:req.params.botid}]})
                  if(!!doc)

                    res.sendStatus(200)
                

                    

                  
                  return   res.sendStatus(404)

              
        
        

}
const editWelcomeTemplate =async (req,res,err)=>{
    const templateDate=req.body.data

     if(templateDate.message!="")
        templateDate.message=templateDate.message!=""?JSON.stringify(templateDate.message):templateDate.message

    
          const template= await   Welcome_template.findOneAndUpdate({ $and: [{ bot: req.params.botid }, { _id: req.params.templateid }] },{...templateDate},{new:true})
                if (template) {
                   return res.json({template})
            
                }
                    res.sendStatus(404)
        
                
               
      
    
}
const getWelcomeTemplates =async(req,res,err)=>{
 const bot = await Bot.findOne({user_id:req.user._id,_id:req.params.botid})
     if(!bot){
         return res.sendStatus(404)
     }
     const templates = await Welcome_template.find({bot:bot._id})
         res.json({templates})
 

     

}

// END WELCOME 
module.exports={
    createWelcomeTemplate,
    removeWelcomeTemplate,
    editWelcomeTemplate,
    getWelcomeTemplates
}