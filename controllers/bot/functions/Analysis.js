
// start analysis
let Bot = require("../../../model/Bot")

const getAllAnalysis=async(req,res,err)=>{
 
  const bots=await  Bot.aggregate([
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


    ])
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
        
        
     
        res.json({ users_no:bots[0].users_no,group:arrDate , today:today })

 
}
//end analysys
module.exports={
    getAllAnalysis
}