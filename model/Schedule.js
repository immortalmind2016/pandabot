const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Schedule_template=require("./Schedule_template")
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
Schedule.post("findOneAndDelete",function(doc){
   /* let query = this.getQuery()["$and"]
    let id=query[0]._id
*/
    console.log("*************************",doc)
    
  Schedule_template.deleteOne({schedule:doc._id},(err)=>{
   

    })
   
 
})
module.exports=mongoose.model("Schedule",Schedule)