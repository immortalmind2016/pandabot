

const Router=require("express").Router();
const adminController=require("../../controllers/admin/adminController")
const passport=require("../../config/jwt_passport")
var jwt = require('jsonwebtoken');

/*
@url api/user/pages
@method GET
@type private
@recieve token
@desc
  
  return array of pages
  
  */

 Router.get("/get-users/",adminController.getUsersData)


/*
@url api/user/pages
@method GET
@type private
@recieve token
@desc
  
  return array of pages
  
  */

 Router.get("/get-bots/",adminController.getBotsData)
 Router.delete("/remove-bot/:botid",adminController.removeBot)
 Router.post("/edit-bot/:botid",adminController.editBot)

module.exports=Router