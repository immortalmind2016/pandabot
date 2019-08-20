const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Schedule_template=new Schema({

    name:String,
    schedule:{
        type:mongoose.Types.ObjectId,
        ref:"schedule"
    },
    message:{
        type:String,
        default:""
    }
 ,
    type:{
        type:String,
        default:null
    },
    attr:{
        type:String,
        default:null
    },
    redirect:{
        type:mongoose.Types.ObjectId,
        ref:"Block",
        default:null
    },
    condition:{
        type:String,
        default:null
    },
    condition_var:{
        type:String,
        default:null
    }, seconds:{
        type:String,
        default:null
    },
    valid:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model("Schedule_template",Schedule_template)