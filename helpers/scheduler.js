
const moment=require('moment')
let schedules=[]
const mongoose=require("mongoose")
const Bot=require("../model/Bot")
const Schedule=require("../model/schedule")
mongoose.connect("mongodb://immortalmind:0115120323a@ds233596.mlab.com:33596/pandabot_beta")
const Page=require("../model/Page")
const Messenger_user=require("../model/Messenger_user")

const Schedule_template=require("../model/Schedule_template")
const {batching,sendToAll} =require("./broadcast")
const config=require("../config/config")
let called=false
const cluster=require("cluster")


 

    

//console.log("MMMMMMMMMMMMMMMMM SCHE")
setInterval(()=>{
schedules.forEach((schedule)=>{
  
  
    const start_date=moment(schedule.start_date).format("YYYY-MM-DD HH:mm")
    const end_date=moment(schedule.end_date).format("YYYY-MM-DD HH:mm")
    const now=moment().format("YYYY-MM-DD HH:mm")
    /*if((moment(moment(start_date)).isBefore(moment(now)))&&schedule.sent==true){
        schedule.sent==false
        Schedule.findOneAndUpdate({_id:schedule._id},{sent:false});

    }*/
    const start_E_now=(moment(start_date).isSame(moment(now)))
    const end_E_now=!!schedule.end_date?(moment(end_date).isSame(moment(now))):false
    const is_between=(moment(now).isBetween(schedule.start_date,schedule.end_date))
    const H_M=moment(now).hours()==moment(schedule.start_date).hours()&&moment(schedule.start_date).minutes()==moment(now).minutes()

        if((start_E_now||end_E_now||(is_between&&H_M))&&!schedule.sent){
            schedule.sent=true;
           // console.log(moment(schedule.start_date).minutes(),"MINUTES",schedule)

           // console.log(start_E_now,end_E_now,(is_between&&H_M))
           // console.log("SENT" )
  
                Page.findOne({bot:schedule.bot},(err,page)=>{
                    if(page){
                   // console.log("PAge",page)
                    Messenger_user.find({page:page._id},(err,users)=>{
                  //    console.log("USERS",users)
                        if(users.length>0){
                            Schedule_template.find({schedule:schedule._id},(err,templates)=>{
                                if(templates.length>0){
                                   let messages=[];
                                //   console.log("TEMPLATES ",templates)
                                   templates.forEach((template)=>{
                                     /*  if(!!template.type){
                                           switch(template.type){
                                               case "input":{
                                              
                                               Messenger_user.updateMany({page:page._id},{$set:{last_input_value:template.variable}})
                                               messages.push(JSON.parse(template.message))
           
                                               }
                                           }
                                           
           
                                       }else*/
                                       messages.push(template)
                                       console.log(template)
                                   })
                                   let batches=batching(users);
                                   let counter=0;
                                   var index=0;
                                    //   console.log(batches,messages,page , "BATCHES", batches[index])
                       
                                       const sendInterval=setInterval(()=>{
                                          
                                    //       console.log("INDEX ",index , "******* ",batches[index])
                                           sendToAll(batches[index],messages,page).then((data)=>{
                                 
                                               counter+=batches[index].length;
                                           //    console.log("COUNTER ",counter)
                                               if(counter%100000==0){
                                                   Schedule.findOneAndUpdate({_id:schedule._id},{sent:true,numbers:counter});
               
                                               }
                                               if(index==batches.length-1){
                                                   Schedule.findOneAndUpdate({_id:schedule._id},{sent:true,numbers:counter});
               
                                               }
               
                   
                                           })
                                           if(index==batches.length-1){
                                            clearInterval(sendInterval)
                                             }else
                                           index++;
                                       })
               
                                }
                               })
                        }
                    })
                }
                })
          
        }
    
})
},1000)
console.log(moment(moment().format("YYYY/MM/DD hh:mm")))

process.on("message",(data)=>{

  //console.log(data.type,"________",schedules)
       if(data.type=="remove"){
        schedules=schedules.filter((schedule)=>schedule._id!=data.schedule._id)

       }else if(data.type=="edit"){
      
    //   console.log("EDIT")
     //  console.log(data.schedule ,moment(data.schedule.start_date))
      // console.log("SCHEDULES ",schedules)

        schedules=schedules.map((schedule)=>{
                if(schedule._id==data.schedule._id){
             return data.schedule
                }
                return schedule
            })
            
        
  
       }
       else if(data.type=="all"){
      //console.log("ALL ",data)
        schedules=[...schedules,...data.schedules]
        
    }
    else if(data.type=="add"){
      //  console.log("add")
      //  console.log(data)
            schedules.push(data.schedule)
            
    }
    else if(data.type=="start"){
    //    console.log("START")
            Schedule.find({},(err,scheds)=>{
                schedules=[...schedules,...scheds]
         //    console.log("SCHEDS ",schedules)
            })
         
      
    }
    /*
    switch(data.type){
        case "remove":{

        }
        case "edit":{

      
          
        }
          
        case "all":
          {
            
          }
          case "add" :{
           
          }
              
          case "start":{
           
           return
          }

     

    }*/
    
})
