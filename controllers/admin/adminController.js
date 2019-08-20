const User = require("../../model/User")
const Bot = require("../../model/Bot")
/*
  {$lookup:{
                        from:"bots",
                        localField: "_id",
                        foreignField: "user_id",
                        
                        as:"bots_arr"
                    }}
*/
/*
                     { $addFields: { "botscount": { $size: "$bots_arr" } } }

*/
/*
       { $project : { name : 1 , facebook_id : 1,image_url:1 ,botscount:1 } } 

*/
const getUsersData = (req, res, err) => {
    User.aggregate([
        { $match: {} },
        {
            $lookup: {
                from: "bots",
                localField: "_id",
                foreignField: "user_id",

                as: "bots_arr"
            }
        }
        ,
        { $addFields: { "bots": { $size: "$bots_arr" } } }



        ,
        { $project: { name: 1, facebook_id: 1, image_url: 1, bots: 1, created_date: 1 } }

    ], (err, users) => {
        res.json({ users })

    })
}
const getBotsData = (req, res, err) => {

    Bot.aggregate([
        { $match: {} },
        {
            $lookup: {
                from: "pages",
                localField: "_id",
                foreignField: "bot",
                as: "page"
            }
        }, {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user"
            }
        }

        ,
        {
            $lookup: {
                from: "messenger_users",
                localField: "page._id",
                foreignField: "page",
                as: "users"

            }
        }
        ,
        { $addFields: { "users": { $size: "$users" } ,page:{$arrayElemAt:["$page",0]}} }
        ,

        { $unwind: '$user' }, //array to object
     //   {$unwind:"$page"},
        { $project: {page:{name:1,page_id:1,img_url:1},users: 1, user: 1, _id: 1,max_number:1, name: 1, paid: 1, paid_from: 1, created_date: 1  } }

    ], (err, bots) => {
        res.json({ bots })

    })
}
const removeBot=(req,res,err)=>{
    Bot.remove({_id:req.params.botid},(err,bot)=>{
        res.sendStatus(200)
    })
}
const editBot=(req,res,err)=>{
    console.log("DATA ",req.body.data)
    Bot.findOneAndUpdate({_id:req.params.botid},{...req.body.data},{new:true},(err,bot)=>{
        res.json({bot})
    })
}
module.exports = {
    getUsersData,
    getBotsData,
    removeBot,
    editBot
}