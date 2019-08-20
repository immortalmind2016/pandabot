const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Bot=new Schema({

    name:String,
    welcome_message:{
        type:String,
        default:`
            [{"text":"welcome to pandabot"}]
        `
    },
    menu:{
        type:String
   
    },
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    admins_ids:{
        type:Array,
        default:[]
    },
    variables:{
        type:Array,
        default:[]
    },
    paid:{
        type:Boolean,
        default:false,
    },
    paid_to:{
        type:String,
        default:"0"
    }
    ,
    max_number:{
        type:Number,
        default:10000
    }
    ,
    created_date:Date,
})
module.exports=mongoose.model("Bot",Bot)