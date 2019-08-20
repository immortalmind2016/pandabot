const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Schedule=new Schema({

    bot:{
        type:mongoose.Types.ObjectId,
        ref:"Bot"
    },

    start_date:{
        type:String
   
    },
    end_date:{
        type:String,
        default:undefined
    },
    day:{
        type:String
    },

        sent:{
        type:Boolean,
        default:false
    },
    numbers:{
        type:Number,
        default:0
    }
  
})

module.exports=mongoose.model("Schedule",Schedule)