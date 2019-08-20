const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Block=new Schema({

    bot:{
        type:mongoose.Types.ObjectId,
        ref:"bot"
    },
    name:String,
    created_date:Date


})

module.exports=mongoose.model("Block",Block)