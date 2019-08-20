const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Ai=new Schema({

    bot:{
        type:mongoose.Types.ObjectId,
        ref:"Bot"
    },
    messages:{
        type:String,
        default:""
    },
    replay:String,

})

module.exports=mongoose.model("Ai",Ai)