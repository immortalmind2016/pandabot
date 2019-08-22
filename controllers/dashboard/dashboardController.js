
const Bot = require("../../model/Bot")
const Ai = require("../../model/Ai")

const Schedule = require("../../model/Schedule")
const delayarr = require("delay-for-array");
const dJSON = require("dirty-json");
const Page = require("../../model/Page");
const MessengerUser = require("../../model/Messenger_user");
const moment = require("moment");
const { batching, sendToAll } = require("../../helpers/broadcast")
const path=require("path")
let axios=require("axios")
const {fork}=require("child_process")
let process=fork(path.resolve("childs","scheduler.js"))
let {subscribeApp}=require("../bot/helpers/pageProfile")

const remove = (req, res, err) => {

    Bot.findOneAndDelete({ $and: [{ _id: req.params.id }, { user_id: req.user._id }] }, (err, bot) => {

        if (bot) {
            return res.sendStatus(200)
        } else {
            res.sendStatus(404)
        }

    })
}
const create = (req, res, err) => {
    const botData = req.body.data;

    console.log(botData)

    let newBot = new Bot({
        ...botData,
        created_date: new Date(),
        user_id: req.user._id
    })
    newBot.save((err, bot) => {
        let newAi=new Ai({
            default_message:true,
            bot:bot._id
        })
        newAi.save()
        if (err) {
            return res.sendStatus(500) //Internal Server Error !
        }
        res.json({ bot })
    })

}

const edit = (req, res, err) => {
    Bot.findOneAndUpdate({ _id: req.params.id }, { ...req.body.data }, { new: true }, (err, bot) => {
        if (bot) {
            return res.send({ bot })
        }
        else {
            res.sendStatus(404)
        }
    })
}

const get = (req, res, err) => {
    Bot.find({ user_id: req.user._id }, (err, bots) => {
        if (bots) {
            return res.send({ bots })
        } else {
            res.sendStatus(404)
        }
    })
}
const getBot = (req, res, err) => {
    Bot.findOne({ user_id: req.user._id,_id:req.params.botid }, (err, bot) => {
        if (bot) {
            return res.send({ bot })
        } else {
            res.sendStatus(404)
        }
    })
}




const sendMessage =
    (req, res) => {
        const rr = dJSON.parse(req.body.message);
        const messages = JSON.parse(
            JSON.stringify(rr).replace("\n", "\\n")
        );
        Page.findOne({ bot_id: req.params.botid }, (err, page) => {
            if(page)
            MessengerUser.find({ page: page._id })
                .lean()
                .on("data", (users) => {

                    console.log("CLOSE GET DATA")

                    let batches = []
                    let counter = 0;
                    let batchNo = 0;
                    let index = 0;

                    batches = batching(users)
                    /* Start Sending Interval */
                    const sendInterval = setInterval(() => {
                        sendToAll(batches[index], messages, page).then((data) => {
                            counter += batches[index].length;
                            if (counter % 100000 == 0) {
                                console.log("COUNTER : ", counter)
                                console.log("DATA ", data)
                                page.number = counter;
                                page.done = true
                                page.progress = false
                                if (index != batches.length - 1) {
                                    page.save((err, pag) => {

                                    });

                                }

                            }
                            if (index == batches.length - 1) {
                                page.number = counter;
                                page.done = true
                                page.progress = false
                                console.log("DONE ALL MESSAGES")
                                page.save((err, pag) => {

                                });

                            }

                        }).catch((e) => {
                            console.log(e)
                        })
                        if (index == batches.length - 1) {
                            console.log("CLEAAAR ")
                            clearInterval(sendInterval)
                        } else {
                            index++;
                        }

                    }, 20)

                    /* end Sending Interval */
                })

        })
       return res.sendStatus(200)

    }

 const connectPage=(req,res,err)=>{
const pageId=req.body.data.pageId;
const pageName=req.body.data.pageName
const botId=req.params.botid;

const accessToken=req.body.data.accessToken
subscribeApp(pageId,accessToken)
Page.findOne({page_id:pageId},(err,page)=>{
   
        const imgUrl="https://graph.facebook.com/v3.2/me/picture?access_token="+accessToken
    
        axios.post("https://graph.facebook.com/v3.3/me/messenger_profile?access_token="+accessToken,{ 
            "get_started":{
              "payload":"<GET_STARTED_PAYLOAD>"
            }
          }).then((response)=>{
                console.log("RESPONSE HERE ",response.data)
          })
    if(!!page){
        page.bot=botId;
        page.access_token=accessToken;
        page.img_url=imgUrl
      
       
        page.save((err,page)=>{
            res.json({page}) 
        })
      
    }else{
    
       
     
        
            let newPage=new Page({
                name:pageName,
                page_id:pageId,
                bot:botId,
                img_url:imgUrl,
                access_token:accessToken
            })
        newPage.save((err,page)=>{
          

            res.json({page})
        })
 
    }

})

}

const connectedPage=(req,res,err)=>{
    Page.findOne({bot:req.params.botid},(err,page)=>{
        console.log("Page ",page)
        res.json({page})
    })
}
const disconnectPage=(req,res,err)=>{
    Page.findOneAndUpdate({bot:req.params.botid},{bot:null},(er,page)=>{
        res.sendStatus(200)
    })
}
module.exports = {
    create,
    remove,
    edit,
    get,
    getBot,

  


  
    sendMessage,
    connectPage,
    connectedPage,
    disconnectPage

}