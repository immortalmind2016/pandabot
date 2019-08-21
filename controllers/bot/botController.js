
var jwt = require('jsonwebtoken');
let Page=require("../../model/Page")
let Bot=require("../../model/Bot")
let Schedule=require("../../model/Schedule")
let axios=require("axios")
const mongoose=require("mongoose")
const ObjectId = mongoose.Types.ObjectId;
const moment =require('moment')
let Schedule_template=require("../../model/Schedule_template")
let Block_template=require("../../model/Block_template")
let {createSchedule,removeSchedule,editSchedule,getSchedulesAll,getSchedule}=require("./functions/schedule")
let {webhook}=require("./functions/bot")
let Messenger_user=require("../../model/Messenger_user")
const Ai = require("../../model/Ai")
let Block=require("../../model/Block")
const parameters = [];
let Welcome_template=require("../../model/Welcome_template")

/*
const options = {
  stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
};*/



const setUpMenu=(req,res,err)=>{
    const data=req.body.data;
  console.log("SETUP MENTUA ",req.params)
    Page.findOne({bot:req.params.botid},(err,page)=>{
        if(!!page){
            axios.post("https://graph.facebook.com/v3.3/me/messenger_profile?access_token="+page.access_token,data).then(response=>{
                Bot.findOneAndUpdate({_id:req.params.botid},{menu:JSON.stringify(data)},(err,bot)=>{
                    res.sendStatus(200) 
                })
                
            }).catch((e)=>{
             console.log(e)
            })
        
        }else{
            res.sendStatus(404)
        }
    })
}

const setWelcomeMessage=(req,res,err)=>{
    const data=req.body.data.welcome_message;
    console.log
    Bot.findOneAndUpdate({_id:req.params.botid},{welcome_message:JSON.stringify(data)},(err,bot)=>{
        res.sendStatus(200) 
    })
}
const getMenu=(req,res,err)=>{
    Bot.findOne({_id:req.params.botid},(err,bot)=>{
       if(!!bot){
          if(!!bot.menu){
            res.json({menu:JSON.parse(bot.menu)})
          }else{
            res.json({menu:null})

          }
       }else{
        res.sendStatus(404)

       }
    })
}
const getWelcomeMessage=(req,res,err)=>{
    console.log(req.params.botid)
    Bot.findOne({_id:req.params.botid},(err,bot)=>{
       if(!!bot){
          if(!!bot.welcome_message){
            res.json({welcome_message:JSON.parse(bot.welcome_message)})
          }else{
            res.json({welcome_message:null})

          }
       }else{
        res.sendStatus(404)

       }
    })
}

const setWebhook=(req,res,err)=>{
    console.log(req.query["hub.challenge"])
    res.send(req.query["hub.challenge"])
}



// START AI

const createAi = (req, res, err) => {
    const aiData = req.body.data
    Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {
            let newAi = new Ai({
                ...aiData,
                bot: bot._id,
          
            })
            newAi.save((err, ai) => {
                if (err) {
                    return res.sendStatus(500)
                }
                return res.json({ ai })

            })
        } else {
            res.sendStatus(404)
        }
    })
}

const removeAi = (req, res, err) => {
    Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {
            Ai.findOneAndRemove({ $and: [{ _id: req.params.aiid }, { bot: bot._id }] }, (err, ai) => {
                if (err) {
                    return res.sendStatus(500)
                }
                res.sendStatus(200)
            })
        } else {
            res.sendStatus(404)

        }

    })
}
const editAi = (req, res, err) => {
    const aiData = req.body.data;

    Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {
            Ai.findOneAndUpdate({ $and: [{ _id: req.params.aiid }, { bot: bot._id }] }, { ...aiData }, { new: true }, (err, ai) => {
                if (err) {
                    return res.sendStatus(500)
                }
                res.json({ ai })
            })
        } else {
            res.sendStatus(404)

        }

    })
}
const getAis = (req, res, err) => {
    Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {
            Ai.find({ bot: bot._id }, (err, ais) => {
                if (err) { 
                    return res.sendStatus(500)
                }
                res.json({ ais })
            }).sort({_id:'desc'})
        } else {
            res.sendStatus(404)

        }

    })
}


// END AI
// Start blocks
const createBlock=(req,res,err)=>{

        
    Bot.findOne({ $and: [{ _id: req.params.botid }] }, (err, bot) => {
        console.log(bot,"BLOCK ",req.params)
        if (bot) {
            const blockData=req.body.data
            
            if(req.body.data.name&&req.body.data){
                let newBlock=new Block({
                   ...blockData,
                   bot:req.params.botid
                })
                .save((err,block)=>{
                    res.json({block})
                })
            }
            else{
                res.sendStatus(500)
            }
          
      
        }else{
            res.sendStatus(404)
        }
    })
}
const removeBlock=(req,res,err)=>{
    Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {
            console.log(req.params)
         Block.findOneAndRemove({$and:[{bot:req.params.botid},{_id:req.params.blockid}]},(err,block)=>{
            Block_template.deleteMany({block:req.params.blockid})
             if(!err){
              return  res.sendStatus(200)
             }else
             res.sendStatus(500)
         })
           
          
      
        }else{
            res.sendStatus(404)
        }
    })
}
const editBlock=(req,res,err)=>{
    Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {
            const blockData=req.body.data

         Block.findOneAndUpdate({$and:[{bot:req.params.botid},{_id:req.params.blockid}]},{...blockData},{new:true},(err,block)=>{
             if(!err){
               
                res.json({block})
             }else
             res.sendStatus(200)
         })
           
          
      
        }else{
            res.sendStatus(404)
        }
    })
}
const getBlocks=(req,res,err)=>{
    Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
    console.log("BOT ",bot)
        if (bot) {
        
  
         Block.find({bot:req.params.botid},(err,blocks)=>{
             console.log(blocks,'BLOCKS ',err)
             if(!err){
                res.json({blocks})
             }else
             res.sendStatus(500)
         })
           
          
      
        }else{
            res.sendStatus(404)
        }
    })
}
const getBlock=(req,res,err)=>{
    Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {
     
         Block.findOne({$and:[{bot:req.params.botid},{_id:req.params.blockid}]},(err,block)=>{
             if(block){
               
                console.log(block, "BLOOOCK" , req.params)
                  Block_template.find({block:block._id},(err,templates)=>{
                 
                    res.json({block,templates})
                 })
             }else
             {
                res.sendStatus(404)
              
             }
           
         })
           
          
      
        }else{
            res.sendStatus(404)
        }
    })
}
// end blocK
// Start Template
const createTemplate=(req,res,err)=>{

    Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {
            const templateDate=req.body.data
            
            try{
                if(templateDate.message)
                 if(templateDate.message!=""){         templateDate.message=JSON.stringify(templateDate.message)      }

                console.log(templateDate)
                Schedule.findOne({ $and: [{ bot: bot._id }, { _id: req.params.scheduleid }] },(err,schedule)=>{
                    if(!!schedule){
              
                        let newTemplate=new Schedule_template({
                            ...templateDate,
                            schedule:schedule._id
                        })
                        console.log("NEW TEMPLATEW ",newTemplate)
                        newTemplate.save((err,template)=>{
                            console.log("SCHEDULE ",template)
                            if(template.message!="")
                            template.message=JSON.parse(template.message)
                            res.json({template})
                        })
                    }else{
                        res.sendStatus(404)
                    }
    
                })
            }catch(e){
                    res.send(e)
            }
           
      
        }else{
            res.sendStatus(404)
        }
    })
}

const removeTemplate=(req,res,err)=>{
        Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {

            Schedule.findOne({ $and: [{ bot: bot._id }, { _id: req.params.scheduleid }] },(err,schedule)=>{
                if(!!schedule){

                  Schedule_template.findOneAndRemove({$and:[{_id:req.params.templateid},{schedule:schedule._id}]},(err,doc)=>{
                  if(!!doc)

                    res.sendStatus(200)
                    else{
                        res.sendStatus(404)

                    }

                  })
                }else{
                    res.sendStatus(404)
                }
            })
        }
    })
 
}
const editTemplate=(req,res,err)=>{
    const templateDate=req.body.data
    console.log("TEMPLATE ",templateDate)
     if(templateDate.message!=""){         templateDate.message=JSON.stringify(templateDate.message)      }
    Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {
            Schedule.findOne({ $and: [{ bot: bot._id }, { _id: req.params.scheduleid }] },(err,schedule)=>{
                if(!!schedule){
                  Schedule_template.findOneAndUpdate({$and:[{_id:req.params.templateid},{schedule:schedule._id}]},{...templateDate},{new:true},(err,template)=>{
                    
                    res.json({template})
                  })
                }else{
                    res.sendStatus(404)
                }
            })
        }
    })
}
// end Template

// Start Block Template
const createBlockTemplate=(req,res,err)=>{
//{ user_id: req.user._id },
    Bot.findOne({ $and: [ { _id: req.params.botid }] }, (err, bot) => {
        console.log("BOT ",req.params)
        if (bot) {
            const templateDate=req.body.data
             
            try{
                 if(templateDate.message!=""){         templateDate.message=JSON.stringify(templateDate.message)      }

            
                Block.findOne({ $and: [{ bot: bot._id }, { _id: req.params.blockid }] },(err,block)=>{
                    
                    if(!!block){
                  
                        let newTemplate=new Block_template({
                            ...templateDate,
                            block:block._id
                        })
                        newTemplate.save((err,template)=>{
                                if (template.message)
                            template.message=JSON.parse(template.message)
                            res.json({template})
                        })
                    }else{
                    
                        res.sendStatus(404)
                    }
    
                })
            }catch(e){
                    res.send(e)
            }
           
      
        }else{
            res.sendStatus(404)
        }
    })
}

const removeBlockTemplate=(req,res,err)=>{
        Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {

            Block.findOne({ $and: [{ bot: bot._id }, { _id: req.params.blockid }] },(err,block)=>{
                if(!!block){

                  Block_template.findOneAndRemove({$and:[{_id:req.params.templateid},{block:block._id}]},(err,doc)=>{
                  if(!!doc)

                    res.sendStatus(200)
                    else{
                        res.sendStatus(404)

                    }

                  })
                }else{
                    res.sendStatus(404)
                }
            })
        }
    })
 
}
const editBlockTemplate=(req,res,err)=>{
    const templateDate=req.body.data
    console.log("TEMPLATE ",templateDate)
    if(templateDate.message!=""){
         if(templateDate.message!=""){         templateDate.message=JSON.stringify(templateDate.message)      }

    }
    Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {
            Block.findOne({ $and: [{ bot: bot._id }, { _id: req.params.blockid }] },(err,block)=>{
                if(!!block){
                  Block_template.findOneAndUpdate({$and:[{_id:req.params.templateid},{block:block._id}]},{...templateDate},{new:true},(err,template)=>{
                    
                    res.json({template})
                  })
                }else{
                    res.sendStatus(404)
                }
            })
        }
    })
}
// end Block Template
// Start Variable
const createVariable=(req,res,err)=>{
    Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {
            const variableData=req.body.data
            const oldVars=bot.variables.push(req.body.data.variable);
            bot.save((err,bot)=>{
                res.json({bot:bot})
            })
      
        }else{
            res.sendStatus(404)
        }
    })
}
const removeVariable=(req,res,err)=>{
    Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {
            const variableData=req.body.data
            const oldVars=bot.variables.filter((variable)=>req.body.data.variable!=variable)
            bot.save((err,bot)=>{
                res.json({bot:bot})
            })
      
        }else{
            res.sendStatus(404)
        }
    })
}


// end Variable
// start analysis
const getAllAnalysis=(req,res,err)=>{
    console.log(req.params.botid)
   /* Bot.findOne({_id:req.params.botid},(err,bot)=>{
        console.log(bot)
    })*/
   /* Messenger_user.aggregate([
        {$match:{"$page_.bot":ObjectId(req.params.botid)}},

        {$lookup:{
            from: "pages",
            localField: "page",
            foreignField: "_id",
            as: "page_"
        }}
    ],(err,bot)=>{
        console.log(bot)
        res.json(bot)
    })*/
    Bot.aggregate([
        { $match: {"_id":ObjectId(req.params.botid)
    } },

    
    {
        $lookup: {
            from: "pages",
            localField: "_id",
            foreignField: "bot",

            as: "page"
        }
    },
       {$lookup:{
        from:"messenger_users",
        localField:"page._id",
        foreignField:"page",
        as:"users"
       }}
      ,
       { $addFields: { "users_no": { $size: "$users" },page:{$arrayElemAt:["$page",0]} ,"group":{"$sum":"$users._id"}}  }     

      //  ,
//
    //    { $unwind: '$user' }, //array to object
     //   {$unwind:"$page"},
,


    ], (err, bots) => {
        let arrDate=[0,0,0,0,0,0,0,0,0,0,0,0]
        let today=0;
        if(!!bots){
            bots[0].users.forEach((user)=>{
                arrDate[moment(user.created_date).month()]= arrDate[moment(user.created_date).month()]+1;
                if(moment(moment(user.created_date).format("YYYY-MM-DD")).isSame(moment().format("YYYY-MM-DD"))){
                        today+=1
                }
            })
        }
        
        
        console.log("BOTS ",bots)
        res.json({ users_no:bots[0].users_no,group:arrDate , today:today })

    })
}
//end analysys

//START WELCOME 


     
const createWelcomeTemplate = (req,res,err)=>{
    Bot.findOne({ $and: [ { _id: req.params.botid }] }, (err, bot) => {
        console.log("BOT ",req.params)
        if (bot) {
            const templateDate=req.body.data
             
            console.log(templateDate)

                 if(templateDate.message!=""){      
                     
                    templateDate.message=JSON.stringify(templateDate.message)      }

    
                    
                 
                  
                        let newTemplate=new Welcome_template({
                            ...templateDate,
                            bot:bot._id
                        })
                        newTemplate.save((err,template)=>{
                                if (template.message)
                            template.message=JSON.parse(template.message)
                            res.json({template})
                        })
               
              
         
           
      
        }else{
            res.sendStatus(404)
        }
    })
}
const removeWelcomeTemplate = (req,res,err)=>{


                  Welcome_template.findOneAndRemove({$and:[{_id:req.params.templateid},{bot:req.params.botid}]},(err,doc)=>{
                  if(!!doc)

                    res.sendStatus(200)
                    else{
                        res.sendStatus(404)

                    }

                  })
            
              
        
        

}
const editWelcomeTemplate = (req,res,err)=>{
    const templateDate=req.body.data
    console.log("TEMPLATE ",templateDate)
     if(templateDate.message!=""){ 
                 templateDate.message=JSON.stringify(templateDate.message)      }
    
            Welcome_template.findOneAndUpdate({ $and: [{ bot: req.params.botid }, { _id: req.params.templateid }] },{...templateDate},{new:true},(err,template)=>{
                if (template) {
                    res.json({template})
            
                }else{
                    res.sendStatus(404)
        
                }
               
            })
      
    
}
const getWelcomeTemplates = (req,res,err)=>{
 Bot.findOne({user_id:req.user._id,_id:req.params.botid},(err,bot)=>{
     if(!bot){
         return res.sendStatus(404)
     }
     Welcome_template.find({bot:bot._id},(err,templates)=>{
         res.json({templates})
     })

     
 })
}

// END WELCOME 
module.exports={
    setUpMenu,
    getMenu,


    setWelcomeMessage,
    getWelcomeMessage,
    webhook,
    setWebhook,


    createSchedule,
    removeSchedule,
    editSchedule,
    getSchedulesAll,
    getSchedule,


    createTemplate,
    removeTemplate,
    editTemplate,
    

    
    createBlockTemplate,
    removeBlockTemplate,
    editBlockTemplate,

     
    createWelcomeTemplate,
    removeWelcomeTemplate,
    editWelcomeTemplate,
    getWelcomeTemplates,

    createAi,
    removeAi,
    editAi,
    getAis,

    createBlock,
    removeBlock,
    editBlock,
    getBlocks,
    getBlock,

    createVariable,
    removeVariable,

    getAllAnalysis


}