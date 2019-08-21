const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Block_template=require("./Block_template")
const Block=new Schema({

    bot:{
        type:mongoose.Types.ObjectId,
        ref:"bot"
    },
    name:String,
    created_date:Date


})
Block.post("findOneAndDelete",function(doc){
 /*   let query = this.getQuery()["$and"]
    let id=query[0]._id*/

    Block_template.deleteOne({block:doc._id},(err)=>{
   

    })
  
})
module.exports=mongoose.model("Block",Block)