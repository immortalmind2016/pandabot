

const Router=require("express").Router();
const indexController=require("../../controllers/index/indexController")
var multer  = require('multer')
const path=require("path")
const fs=require("fs")
var Jimp = require("jimp");
var sizeOf = require('image-size');
const imageDest="/assets/images/"
const storage = multer.diskStorage({
    destination: path.resolve("public","assets","images"),
    filename: function(req, file, cb){
       cb(null,"image" + Date.now() + path.extname(file.originalname));
    }
 });
 var upload =multer({storage})


/*
@url api/user/login
@method post
@type public
@recieve user data
@desc
    return token
*/

Router.post(
    "/upload-image/:oldimage",upload.single("upload-image"),(req,res,err)=>{
        console.log("assets/images/"+req.params.oldimage)
        fs.unlink( path.resolve("public","assets","images",req.params.oldimage),(err)=>{
console.log("ERR",err)
        }) 
        console.log(req.query , "QUERY")
        if(!req.query["type"]){
            
            Jimp.read(
                path.resolve("public","assets","images",req.file.filename),
             async  (err, lenna) => {
                 if (err) throw err;
                 const height=sizeOf(path.resolve("public","assets","images",req.file.filename)).height
   
              await lenna
   
                   .resize(height*1.92, height) // resize
                   .write(path.resolve("public","assets","images",req.file.filename)); // save
                   console.log(req.file)
                   res.json({img:"https://pandabotbeta2.herokuapp.com/assets/images/"+req.file.filename})
               })
        }else{
            res.json({img:"https://pandabotbeta2.herokuapp.com/assets/images/"+req.file.filename})

        }
        
   
    }
)

module.exports=Router