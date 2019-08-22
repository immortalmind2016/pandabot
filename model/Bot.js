const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Schedule=require("./Schedule")
const Block=require("./Block")
const Ai=require("./Ai")

const Welcome_template=require("./Welcome_template")

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
Bot.post("findOneAndDelete",function(doc){

 
    Schedule.findOneAndDelete({bot:doc.id},(err)=>{
        console.log("ERRRR ",err)
    })
    Block.findOneAndDelete({bot:doc.id},(err)=>{

    })
    Welcome_template.findOneAndDelete({bot:doc.id},(err)=>{
    })
    Ai.findOneAndDelete({bot:doc.id},(err)=>{
    })
   
})
module.exports=mongoose.model("Bot",Bot)