const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Messenger_user=new Schema({

    page:{
        type:mongoose.Types.ObjectId,
        ref:"Page"
    },
    messenger_id:String,
    created_date:{
        type:Date,
        default:new Date()
    },
    last_input_value:{
        type:String,
        default:null
    },
    first_name:{
        type:String,
        default:""
    },
    last_name:{
        type:String,
        default:""
    },
    gender:{
        type:String,
        default:""
    },
    local:{
        type:String,
        default:""
    },
    timezone:{
        type:String,
        default:""
    }
    



})



module.exports=mongoose.model("Messenger_user",Messenger_user)