

const Router=require("express").Router();
const indexController=require("../../controllers/index/indexController")
const passport=require("../../config/jwt_passport")
var jwt = require('jsonwebtoken');
var multer  = require('multer')
const facebook=require("../../config/facebook_passport")
const path=require("path")
const fs=require("fs")
var Jimp = require("jimp");

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
        Jimp.read(
            "/"+req.file.filename,
          async  (err, lenna) => {
              if (err) throw err;
           await lenna
                .resize(500, 260) // resize
                .write("./"+req.file.filename); // save
                console.log(req.file)
                res.json({img:"https://pandabotbeta2.herokuapp.com/assets/images/"+req.file.filename})
            })
   
    }
)

module.exports=Router