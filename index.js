const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const user=require("./routes/api/user.js")
const bot=require("./routes/api/bot.js");
const dashboard=require("./routes/api/dashboard");
const index=require("./routes/api/index");

const admin=require("./routes/api/admin");
const Schedule=require("./model/Schedule");
const mongoose=require("mongoose");
const { fork}=require("child_process")
const process = require('process');
const config=require("./config/config")
const cors=require("cors")
var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  useNewUrlParser:true
};
mongoose.connect(config.mode=="dev"?"mongodb://immortalmind:0115120323a@ds233596.mlab.com:33596/pandabot_beta":"mongodb://immortalmind:0115120323a@ds235197.mlab.com:35197/pandabot_beta_dev",{ useNewUrlParser:true
})
const cluster=require("cluster")
const parameters = [];

let path=require("path")



if(cluster.isMaster){
  console.log('Master ' + process.pid + ' has started.');
  const child = fork(path.resolve("helpers","scheduler.js"), parameters);

  console.log("CLUSER ",cluster.isMaster)
  
    console.log("FIND ONE ")    //schedules=[...schedules,...scheds]
      child.send({type:"start"})




   for (var i = 0; i < 2; i++) {
    var worker = cluster.fork();

    worker.on('message', function(msg) {
      child.send(msg)
  //    console.log('Master ' + process.pid + ' received message from worker ' + '.', msg);
    });


  }
  
}else{
  
  console.log("START child")
  app.use(express.static("public"))
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:false}))
  app.use(cors())
         app.use(function(req, res, next) {
          var allowedOrigins = ['https://d2a2bac9.ngrok.io', 'http://localhost:2019', 'http://127.0.0.1:9000', 'http://localhost:9000',"https://08e28f66.ngrok.io"];
          var origin = req.headers.origin;
          if(allowedOrigins.indexOf(origin) > -1){
               res.setHeader('Access-Control-Allow-Origin', origin);
          }
          //      res.setHeader("Access-Control-Allow-Origin", "*");
                //res.setHeader("Access-Control-Allow-Origin", "");

               res.setHeader("Access-Control-Allow-Methods", "POST, GET,DELETE,OPTIONS");
               res.setHeader("Access-Control-Max-Age", "3600");
               res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
         
             next();
           });
           
  app.get("/test",(req,res,err)=>{
  
         processs.send("hi");
      
  
       return  res.json({})
  
  })
  
  app.use("/api/user",user)
  app.use("/api/bot",bot)
  app.use("/api/admin",admin)
 
  app.use("/api/dashboard",dashboard)
  app.use("/api",index)
  
  app.use("*",(req,res,err)=>{
    res.sendFile(path.resolve(__dirname,"build","index.html"))
  })

  app.listen(process.env.PORT||80)

}
