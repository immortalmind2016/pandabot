
let x=['5']
console.log("HHH")
async function test(){
      
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            
            resolve(5)
            return 5
        },5000)
    });
}

  console.log("SSS")
        process.on("message",async (data)=>{
        
            x.push(data)
            test()
            
            process.send({counter:x})
        })

