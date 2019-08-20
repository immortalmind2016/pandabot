const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const User=new Schema({
    facebook_id:String,
    name:String,
    access_token:String,
    image_url:String,
    created_date:String,
})

module.exports=mongoose.model("User",User)