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


    if (req.body.object == "page") {
        const messaging = entry.messaging;
        messaging.forEach(async(message) => {
            const senderId = message.sender.id;
            const recipientId = message.recipient.id;
            Messenger_user.findOne({
                messenger_id: senderId
            }, async(err, user) => {

                const page = await Page.findOne({
                    page_id: recipientId
                })
                

                if (!user && page && page.page_id == recipientId) {
                    if (page.bot){
                        const bot = await Bot.findOne({
                            _id: page.bot
                        })
                        const number = await Messenger_user.count({
                            page: page._id
                        })
    
                        if (!number >= bot.max_number) {
                            const data = await getUserData(senderId, page.access_token)
                            const messengerUser = new Messenger_user({
                                messenger_id: senderId,
                                page: page._id,
                                last_name: data.last_name,
                                first_name: data.first_name
                            })
                            await messengerUser.save()
    
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
                    if (!!message.postback) {
                        const postback = message.postback;
                        const title = message.postback.payload;
                        responseToPostback(recipientId, senderId, title, page.bot)
                    } else {
                        responseAi(recipientId, senderId, message.message.text)

                    }
                }

            })


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