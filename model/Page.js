const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Page=new Schema({

    bot:{
        type:mongoose.Types.ObjectId,
        ref:"Bot",
        default:null
    },
    page_id:String,
    name:String,
    img_url:String,
    access_token:String


})

module.exports=mongoose.model("Page",Page)