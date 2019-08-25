

// Start Variable
let Block=require("../../../model/Block")

const createVariable=async(req,res,err)=>{
   const bot=await Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] })
        if (bot) {
            const variableData=req.body.data
            const oldVars=bot.variables.push(req.body.data.variable);
            await bot.save()
                return res.json({bot:bot})
            }
      
        
            res.sendStatus(404)
        
   
}
const removeVariable=async(req,res,err)=>{
    const bot =Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] })
        if (bot) {
            const variableData=req.body.data
            const oldVars=bot.variables.filter((variable)=>req.body.data.variable!=variable)
            await bot.save()
              return  res.json({bot:bot})
            
      
        }
            res.sendStatus(404)
        
   
}


// end Variable
module.exports={
    createVariable,
    removeVariable
    
}