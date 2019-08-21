let Bot=require("../../../model/Bot")
let Schedule_template=require("../../../model/Schedule_template")
const fork = require('child_process').fork;
const parameters = [];

let path=require("path")

//const child = fork(path.resolve("helpers","scheduler.js"), parameters);


let Schedule=require("../../../model/Schedule")
let {responseToPostback}=require("../../bot/helpers/pageProfile")

// Start schedule

const createSchedule=(req,res,err)=>{
    const schedule=req.body.data;
    console.log(req.params.botid,"IDDDDDD")
    let newSchedule=new Schedule({...schedule,bot:req.params.botid});
    
    newSchedule.save((err,schedule)=>{
        if(!!err){
            return res.json({error:err})
        }
       // child.send({schedule,type:"add"})
        process.send({schedule,type:"add"},()=>{

        })
        res.json({schedule})
    })

}
const removeSchedule = (req, res, err) => {

    Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {
            Schedule.findOneAndRemove({ $and: [{ _id: req.params.scheduleid }, { bot: bot._id }] }, (err, schedule) => {
                Schedule_template.deleteMany({schedule:req.params.scheduleid})

                if (err) {
                    return res.sendStatus(500)
                }
                if(!!schedule){
                  //  child.send({schedule,type:"remove"})
                    process.send({schedule,type:"remove"},()=>{

                    })
                    Schedule_template.remove({schedule:schedule._id})
                    res.sendStatus(200)
                }else{

                    res.sendStatus(404)

                }
           
            })
        } else {
            res.sendStatus(404)

        }

    })

}
const editSchedule = (req, res, err) => {
    const scheduleData = req.body.data;
    if(!scheduleData.end_date){
        scheduleData.end_date=undefined
    }
    Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {
            Schedule.findOneAndUpdate({ $and: [{ _id: req.params.scheduleid }, { bot: bot._id }] }, { ...scheduleData }, { new: true }, (err, schedule) => {
                if (err) {
                    return res.sendStatus(500)
                }
            //    child.send({schedule,type:"edit"})
            process.send({schedule,type:"edit"},()=>{

            })
                res.json({ schedule })
            })
        } else {
            res.sendStatus(404)

        }

    })
}
const getSchedulesAll = (req, res, err) => {
    console.log("REQ.USER ",req.user )
    Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {
            Schedule.find({ bot: bot._id }, (err, schedules) => {
                if (err) {
                    return res.sendStatus(500)
                }
                
                res.json({ schedules })
            }).sort({_id: 'desc'})
        } else {
            res.sendStatus(404)

        }

    })

}
const getSchedule = (req, res, err) => {
    Bot.findOne({ $and: [{ user_id: req.user._id }, { _id: req.params.botid }] }, (err, bot) => {
        if (bot) {
            Schedule.findOne({ $and: [{ _id: req.params.scheduleid }, { bot: bot._id }] }, (err, schedule) => {
                if (err) {
                    console.log(err)
                    return res.sendStatus(500)
                }
                if(!!schedule){
                    Schedule_template.find({schedule:schedule._id},(err,templates)=>{
                   
                  
                        res.json({ schedule,templates })
    
                    }).lean()
                }else{
                    res.sendStatus(404)

                }
              
            })
        } else {
            res.sendStatus(404)

        }

    })
}

// end schedule

module.exports={
    createSchedule,
    removeSchedule,
    editSchedule,
    getSchedulesAll,
    getSchedule,

}