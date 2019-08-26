let Bot = require("../../../model/Bot")
let Schedule_template = require("../../../model/Schedule_template")
let Schedule=require("../../../model/Schedule")


// Start schedule

const createSchedule = async (req, res, err) => {
    const schedule = req.body.data;
    let newSchedule = new Schedule({ ...schedule, bot: req.params.botid });
    try {
        await newSchedule.save()
        process.send({ schedule: newSchedule, type: "add" }, () => { })
        res.json({ schedule: newSchedule })
    } catch (e) {
        res.send(e)
    }



}
const removeSchedule = async (req, res, err) => {
    try {

    } catch (e) {
        return res.sendStatus(500)

    }
    const bot = await Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] })
    if (bot) {
        const schedule = await Schedule.findOneAndDelete({ $and: [{ _id: req.params.scheduleid }, { bot: bot._id }] })

        if (!!schedule) {
            process.send({ schedule, type: "remove" }, () => { })
            return res.sendStatus(200)
        }
    }
    if (!schedule || !bot) {
        res.sendStatus(404)

    }


}
const editSchedule = async (req, res, err) => {
    const scheduleData = req.body.data;
    scheduleData.end_date = !scheduleData.end_date ? undefined : scheduleData.end_date
    const bot = await Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] })
    if (bot) {
        const schedule = await Schedule.findOneAndUpdate({ $and: [{ _id: req.params.scheduleid }, { bot: bot._id }] }, { ...scheduleData,sent:false }, { new: true })
        process.send({ schedule, type: "edit" }, () => { })
        res.json({ schedule })
    } else {
        res.sendStatus(404)
    }
}
const getSchedulesAll = async (req, res, err) => {

    const bot = await Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] })
    if (bot) {
        const schedules = await Schedule.find({ bot: bot._id }).sort({ _id: 'desc' })

        res.json({ schedules })

    } else {
        res.sendStatus(404)

    }


}
const getSchedule = async(req, res, err) => {
    const bot = await Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] })
    if (bot) {
        const schedule = await Schedule.findOne({ $and: [{ _id: req.params.scheduleid }, { bot: bot._id }] })
        if (!!schedule) {
            const templates = await Schedule_template.find({ schedule: schedule._id });
            return res.json({ schedule, templates })
        }

    }
    if (!schedule || !bot) {
        res.sendStatus(404)

    }

}

// end schedule

// Start Template
const createTemplate=async(req,res,err)=>{

    const bot = await Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] })
        if (bot) {
            const templateDate=req.body.data
            
            try{
                if(templateDate.message)     
                     templateDate.message=templateDate.message!=""?JSON.stringify(templateDate.message):templateDate.message
                

                const schedule = await Schedule.findOne({ $and: [{ bot: bot._id }, { _id: req.params.scheduleid }] })
                    if(!!schedule){
                        let newTemplate=new Schedule_template({
                            ...templateDate,
                            schedule:schedule._id
                        })
             
                        await newTemplate.save()
                        if(newTemplate.message!="")
                        newTemplate.message=JSON.parse(newTemplate.message)
                        res.json({template:newTemplate})
                        
                    }else{
                        return res.sendStatus(404)
                    }
    
                
            }catch(e){
                   return res.send(e)
            }
           
    
        }
          return  res.sendStatus(404)
        
    
}

const removeTemplate=async(req,res,err)=>{
      const bot = await  Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] })
        if (bot) {

           const schedule=await  Schedule.findOne({ $and: [{ bot: bot._id }, { _id: req.params.scheduleid }] })
                if(!!schedule){
                const doc=Schedule_template.findOneAndRemove({$and:[{_id:req.params.templateid},{schedule:schedule._id}]})
                  if(!!doc)

                   return res.sendStatus(200)
                   

                 
                }
                if(!schedule||!Schedule_template)
                    res.sendStatus(404)
                
           
        }
  
 
}
const editTemplate=async(req,res,err)=>{
    const templateDate=req.body.data

    if(templateDate.message)     
        templateDate.message=templateDate.message!=""?JSON.stringify(templateDate.message):templateDate.message
        
    const bot = await Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] })
        if (bot) {
          const schedule = await   Schedule.findOne({ $and: [{ bot: bot._id }, { _id: req.params.scheduleid }] })
                if(!!schedule){
                const template= await Schedule_template.findOneAndUpdate({$and:[{_id:req.params.templateid},{schedule:schedule._id}]},{...templateDate},{new:true})
                    return res.json({template})
                
                }
        }
        res.sendStatus(401)
   
}
// end Template


module.exports = {
    createSchedule,
    removeSchedule,
    editSchedule,
    getSchedulesAll,
    getSchedule,
    createTemplate,
    removeTemplate,
    editTemplate

}