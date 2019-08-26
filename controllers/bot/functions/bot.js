let {
    responseToPostback
} = require("../../bot/helpers/pageProfile")
let Messenger_user = require("../../../model/Messenger_user")
let {
    getUserData
} = require("../helpers/userProfile")
let Page = require("../../../model/Page")
let Bot = require("../../../model/Bot")

const webhook = (req, res, err) => {
    const entry = req.body.entry[0]

  console.log("WEBHOOK")
    if (req.body.object == "page") {
        const messaging = entry.messaging;
        messaging.forEach(async(message) => {
            const senderId = message.sender.id;
            const recipientId = message.recipient.id;
            const user= await Messenger_user.findOne({
                messenger_id: senderId
            })

                const page = await Page.findOne({
                    page_id: recipientId
                })
                console.log("PAGE ",page._id)
                

                if (!user && page && page.page_id == recipientId) {
                    console.log("NOT FOUND USER")
                    if (page.bot){
                        const bot = await Bot.findOne({
                            _id: page.bot
                        })
                        const number = await Messenger_user.countDocuments({
                            page: page._id
                        })
                        console.log("NUMBER ",number ,"__", bot.max_number)
    
                        if (!(number >= bot.max_number)) {
                            console.log("NOT EQUAL MAX")
                            const data = await getUserData(senderId, page.access_token)
                            const messengerUser = new Messenger_user({
                                messenger_id: senderId,
                                page: page._id,
                                last_name: data.last_name,
                                first_name: data.first_name
                            })
                            await messengerUser.save()
                            console.log("SAVED")
    
                            if (!!message.postback) {
                                const postback = message.postback;
                                const title = message.postback.payload;
                                responseToPostback(recipientId, senderId, title, page.bot)
                            } else {
                                responseAi(recipientId, senderId, message.message.text)
                            }
    
                        }
    
                    }
                       
                   

                } else if (user && page && page.page_id == recipientId && page.bot) {
                    console.log(" FOUND USER")

                    if (!!message.postback) {
                        const postback = message.postback;
                        const title = message.postback.payload;
                        responseToPostback(recipientId, senderId, title, page.bot)
                    } else {
                        responseAi(recipientId, senderId, message.message.text)

                    }
                }

           


        })


    }
    res.sendStatus(200)
}
const setWebhook=(req,res,err)=>{
    console.log(req.query["hub.challenge"])
    res.send(req.query["hub.challenge"])
}

module.exports = {
    webhook,
    setWebhook
}