

const Router=require("express").Router();
const userController=require("../../controllers/user/userController")
const passport=require("../../config/jwt_passport")
var jwt = require('jsonwebtoken');

const facebook=require("../../config/facebook_passport")




/*
@url api/user/login
@method post
@type public
@recieve user data
@desc
  
  return token
  
  */
  
Router.post("/login",userController.login)
//Router.get("/login",passport.authenticate('facebook'))



/*
@url api/user/signup
@method post
@type public
@recieve user data
@desc
  
  return token
  
  */

Router.post("/signup",userController.create)




/*
@url api/user/
@method GET
@type private
@recieve token
@desc
  
  return auth or not
  
  */

Router.get("/",passport.authenticate("jwt",{session:false}),userController.get)


/*
@url api/user/pages
@method GET
@type private
@recieve token
@desc
  
  return array of pages
  
  */

 Router.get("/pages",passport.authenticate("jwt",{session:false}),userController.pages)



 http://localhost:3000/api/user/auth/facebook/callback
 Router.get("/auth/facebook/callback",facebook.authenticate("facebook",{session:false}),(req,res,err)=>{
  var token = jwt.sign({ 
    ...req.user
    
 }, 'secret' , { expiresIn: '1d' });
 //res.json({success:true,token:"Bearer "+token})
    console.log("CALLBACK ",req.user)

    res.status(200).redirect(" http://d2a2bac9.ngrok.io/auth/facebook?token="+token);

 })
 Router.get("/auth/facebook",facebook.authenticate("facebook",{ scope: ['manage_pages',"pages_messaging"] }))

module.exports=Router