
let {createSchedule,removeSchedule,editSchedule,getSchedulesAll,getSchedule,
    createTemplate,
    removeTemplate,
    editTemplate}=require("./functions/schedule")
let {
    webhook
    ,setWebhook}
    =require("./functions/bot")
    let {
        getAllAnalysis
        }
        =require("./functions/Analysis")
let {createAi,
    getAis,
    editAi,
    removeAi,
    } =require("./functions/Ai")
    let {
        getMenu,
        getWelcomeMessage,
        setWelcomeMessage,
        setUpMenu
    
        } =require("./functions/pageSetup")
let{
    createBlock,
    removeBlock,
    editBlock,
    getBlock,
    getBlocks,
    editBlockTemplate,
    createBlockTemplate,
    removeBlockTemplate
} =require("./functions/Blocks")
let{
    createVariable,
    removeVariable
} =require("./functions/Variables")
let{
    createWelcomeTemplate,
    removeWelcomeTemplate,
    editWelcomeTemplate,
    getWelcomeTemplates
} =require("./functions/Welcome")


/*
const options = {
  stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
};*/



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