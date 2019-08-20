const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const User_attr=new Schema({

    name:String,
    user:{
        type:mongoose.Types.ObjectId,
        ref:"Messenger_user"
    },
    name:{
        type:String,
        default:""
    },
    value:{
        type:String,
        default:""
    }
})

module.exports=mongoose.model("User_attr",User_attr)