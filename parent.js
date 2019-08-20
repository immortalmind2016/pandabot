const fork = require('child_process').fork;

const parameters = [];
const options = {
  stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
};

const child = fork("./testMulti.js", parameters);
child.send("hh")
child.on("message",async (data)=>{
    console.log(data)
})