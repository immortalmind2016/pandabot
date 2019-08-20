
let arr=[50]


const tests2=require("./tests2")(arr)

const cron=require('cron').CronJob
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  setInterval(()=>{
console.log(arr.length)


  },5000)

     //CRON JOB
     yourCallbackFunc=()=>{
        console.log(jsonData)
     }
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });


} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
    
  }).listen(1000);

  console.log(`Worker ${process.pid} started`);
}

module.exports ={
    arr:[50]

}
