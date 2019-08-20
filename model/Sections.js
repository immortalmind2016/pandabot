const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Section=new Schema({

    name:String,
    bot_id:{
        type:mongoose.Types.ObjectId,
        ref:"Bot"
    },
    json_data:{
        type:String,
        default:""
    },
})

module.exports=mongoose.model("Section",Section)