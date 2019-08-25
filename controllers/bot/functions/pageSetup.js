

const Bot =require("../../../model/Bot")
const Page =require("../../../model/Page")

const setUpMenu=async(req,res,err)=>{
    const data=req.body.data;
    const page=awaitPage.findOne({bot:req.params.botid})
        if(!!page){
            try{
                await axios.post("https://graph.facebook.com/v3.3/me/messenger_profile?access_token="+page.access_token,data)
                Bot.findOneAndUpdate({_id:req.params.botid},{menu:JSON.stringify(data)},(err,bot)=>{
                  return  res.sendStatus(200) 
                })
            }catch(e){
                console.log(e)
            }
            
                
            
        }
     res.sendStatus(404)
        
    
}

const setWelcomeMessage=async(req,res,err)=>{
    const data=req.body.data.welcome_message;
   const bot=await Bot.findOneAndUpdate({_id:req.params.botid},{welcome_message:JSON.stringify(data)})
       if(bot){
       return res.sendStatus(200) 
       }
       res.sendStatus(401)
   
}
const getMenu=async(req,res,err)=>{
   const bot=await Bot.findOne({_id:req.params.botid})
       if(!!bot){
          if(!!bot.menu){
          return  res.json({menu:JSON.parse(bot.menu)})
          }
          return res.json({menu:null})       
       }
        res.sendStatus(404)

       
 
}
const getWelcomeMessage=(req,res,err)=>{
    const bot=Bot.findOne({_id:req.params.botid})
       if(!!bot){
          if(!!bot.welcome_message){
            return res.json({welcome_message:JSON.parse(bot.welcome_message)})
          }
            return res.json({welcome_message:null})   
       }
        res.sendStatus(404)

       

}


module.exports={
    getMenu,
    getWelcomeMessage,
    setWelcomeMessage,
    setUpMenu

}