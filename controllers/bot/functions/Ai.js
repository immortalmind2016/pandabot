
let Bot = require("../../../model/Bot")
let Ai = require("../../../model/Ai")

// START AI

const createAi =async(req, res, err) => {
    const aiData = req.body.data
    const bot=Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }]})
        if (bot) {
            let ai = new Ai({
                ...aiData,
                bot: bot._id,
            })
            try{
                await ai.save()
                return res.json({ ai })

            }catch(e){
                return res.sendStatus(500)
            }
          
        }

            res.sendStatus(404)
        

}

const removeAi = async (req, res, err) => {
    const bot=Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] })
        if (bot) {
           await  Ai.findOneAndRemove({ $and: [{ _id: req.params.aiid }, { bot: bot._id }] })
            return res.sendStatus(200)
           
        }
            res.sendStatus(404)

        
   
}
const editAi = async(req, res, err) => {
    const aiData = req.body.data;
    const bot=Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] })
        if (bot) {
           const ai=await Ai.findOneAndUpdate({ $and: [{ _id: req.params.aiid }, { bot: bot._id }] }, { ...aiData }, { new: true })
               return  res.json({ ai })
        }
        res.sendStatus(404)

        

}
const getAis = async(req, res, err) => {
    const bot=await Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] })
        if (bot) {
            const ais=await Ai.find({ bot: bot._id }).sort({_id:'desc'})
            return res.json({ ais })
        } 
            res.sendStatus(404)
      
}


// END AI

module.exports = {
    createAi,
    getAis,
    editAi,
    removeAi
    
}