

const Router=require("express").Router();
const passport=require("../../config/jwt_passport")

const botController=require("../../controllers/bot/botController")
/*
 @url api/bot/
 @method POST
 @type Private
 @params user data
 @desc
  for creating new bot\
  return created Bot Data
  
*/
Router.post("/setup-menu/:botid",passport.authenticate("jwt",{session:false}),botController.setUpMenu)
/*
 @url api/bot/
 @method POST
 @type Private
 @params user data
 @desc
  for creating new bot\
  return created Bot Data
  
*/
Router.get("/get-menu/:botid",passport.authenticate("jwt",{session:false}),botController.getMenu)


/*
 @url api/bot/
 @method POST
 @type Private
 @params user data
 @desc
  for creating new bot\
  return created Bot Data
  
*/
Router.get("/get-menu/:botid",passport.authenticate("jwt",{session:false}),botController.getMenu)

/*
 @url api/bot/
 @method POST
 @type Private
 @params user data
 @desc
  for creating new bot\
  return created Bot Data
  
*/
Router.get("/get-welcome-message/:botid",passport.authenticate("jwt",{session:false}),botController.getWelcomeMessage)
/*
 @url api/bot/
 @method POST
 @type Private
 @params user data
 @desc
  for creating new bot\
  return created Bot Data
  
*/
Router.post("/set-welcome-message/:botid",passport.authenticate("jwt",{session:false}),botController.setWelcomeMessage)

/*
 @url api/bot/
 @method POST
 @type Private
 @params user data
 @desc
  for creating new bot\
  return created Bot Data
  
*/
Router.post("/schedule/create/:botid",passport.authenticate("jwt",{session:false}),botController.createSchedule)


/*
@url api/dashboard/schedule/remove/:botid/:scheduleid
@method Delete
@params botid,scheduleid
@type Private
@recieve 
@desc
  for remove schedule
  return status
  
  */

Router.delete("/schedule/remove/:botid/:scheduleid",passport.authenticate("jwt",{session:false}),botController.removeSchedule)

/*
@url api/dashboard/schedule/edit/:botid/:scheduleid
@method POST
@params botid,scheduleid
@type Private
@recieve Schedule Data
@desc
  for edit schedule
  return edited schedule new data
  
  */
Router.post("/schedule/edit/:botid/:scheduleid",passport.authenticate("jwt",{session:false}),botController.editSchedule)

/*
@url api/dashboard/schedule/get-all/:botid
@method GET
@params botid
@type Private
@recieve 
@desc
  get all schedules for botid
  return schedules Array
  
  */
Router.get("/schedule/get-all/:botid/",passport.authenticate("jwt",{session:false}),botController.getSchedulesAll)

/*
@url api/dashboard/schedule/:botid/:scheduleid
@method GET
@params botid,scheduleid
@type Private
@recieve 
@desc
  get schedule by ids
  return schedule data
  
  */
Router.get("/schedule/get/:botid/:scheduleid",passport.authenticate("jwt",{session:false}),botController.getSchedule)

/*
 @url api/bot/
 @method POST
 @type Private
 @params user data
 @desc
  for creating new bot\
  return created Bot Data
  
*/
/* START AI ROUTE */


/*
 @url api/dashboard/ai/create/:botid
 @method Post
 @type Private
 @recieve 
 @params botid
 @desc
  for creating ai
  return created ai data
  
  */

 Router.post("/ai/create/:botid",passport.authenticate("jwt",{session:false}),botController.createAi)



 /*
 @url api/dashboard/ai/remove/:botid/:aiid
 @method Delete
 @params botid,aiid
 @type Private.,,,,,,,,,,,,,,,,,,,,,,,,,
 @recieve 
 @desc
   for remove ai
   return status
   
   */
 
 Router.delete("/ai/remove/:botid/:aiid",passport.authenticate("jwt",{session:false}),botController.removeAi)
 
 
 
 /*
 @url api/dashboard/ai/edit/:botid/:aiid
 @method POST
 @params botid,aiid
 @type Private
 @recieve ai Data
 @desc
   for edit ai
   return edited ai new data
   
   */
 Router.post("/ai/edit/:botid/:aiid",passport.authenticate("jwt",{session:false}),botController.editAi)
 
 /*
 @url api/dashboard/ai/:botid/:aiid
 @method GET
 @params botid,aiid
 @type Private
 @recieve 
 @desc
   get ai by ids
   return ai data
   
   */
 Router.get("/ai/get-all/:botid/",passport.authenticate("jwt",{session:false}),botController.getAis)
 
 /* END AI ROUTE */
 
Router.post("/webhook/",botController.webhook)

Router.get("/webhook/",botController.setWebhook)







/* START BLOCK ROUTE */


/*
 @url api/dashboard/ai/create/:botid
 @method Post
 @type Private
 @recieve 
 @params botid
 @desc
  for creating ai
  return created ai data
  
  */

 Router.post("/block/create/:botid",passport.authenticate("jwt",{session:false}),botController.createBlock)



 /*
 @url api/dashboard/ai/remove/:botid/:aiid
 @method Delete
 @params botid,aiid
 @type Private.,,,,,,,,,,,,,,,,,,,,,,,,,
 @recieve 
 @desc
   for remove ai
   return status
   
   */
 
 Router.delete("/block/remove/:botid/:blockid",passport.authenticate("jwt",{session:false}),botController.removeBlock)
 
 
 
 /*
 @url api/dashboard/ai/edit/:botid/:aiid
 @method POST
 @params botid,aiid
 @type Private
 @recieve ai Data
 @desc
   for edit ai
   return edited ai new data
   
   */
 Router.post("/block/edit/:botid/:blockid",passport.authenticate("jwt",{session:false}),botController.editBlock)
 
 /*
 @url api/dashboard/ai/:botid/:aiid
 @method GET
 @params botid,aiid
 @type Private
 @recieve 
 @desc
   get ai by ids
   return ai data
   
   */
 Router.get("/block/get-all/:botid/",passport.authenticate("jwt",{session:false}),botController.getBlocks)
  
 /*
 @url api/dashboard/ai/:botid/:aiid
 @method GET
 @params botid,aiid
 @type Private
 @recieve 
 @desc
   get ai by ids
   return ai data
   
   */
  Router.get("/block/get/:botid/:blockid",passport.authenticate("jwt",{session:false}),botController.getBlock)
 
 /* END BLOCK ROUTE */









 
/* START TEMPLATE ROUTE */


/*
 @url api/dashboard/ai/create/:botid
 @method Post
 @type Private
 @recieve 
 @params botid
 @desc
  for creating ai
  return created ai data
  
  */

 Router.post("/template/create/:botid/:scheduleid",passport.authenticate("jwt",{session:false}),botController.createTemplate)



 /*
 @url api/dashboard/ai/remove/:botid/:aiid
 @method Delete
 @params botid,aiid
 @type Private.,,,,,,,,,,,,,,,,,,,,,,,,,
 @recieve 
 @desc
   for remove ai
   return status
   
   */
 
 Router.delete("/template/remove/:botid/:scheduleid/:templateid",passport.authenticate("jwt",{session:false}),botController.removeTemplate)
 
 
 
 /*
 @url api/dashboard/ai/edit/:botid/:aiid
 @method POST
 @params botid,aiid
 @type Private
 @recieve ai Data
 @desc
   for edit ai
   return edited ai new data
   
   */
 Router.post("/template/edit/:botid/:scheduleid/:templateid",passport.authenticate("jwt",{session:false}),botController.editTemplate)

 /* END TEMPLATE ROUTE */
 
/* START BLOCK TEMPLATE ROUTE */


/*
 @url api/dashboard/ai/create/:botid
 @method Post
 @type Private
 @recieve 
 @params botid
 @desc
  for creating ai
  return created ai data
  
  */

 Router.post("/block-template/create/:botid/:blockid",passport.authenticate("jwt",{session:false}),botController.createBlockTemplate)



 /*
 @url api/dashboard/ai/remove/:botid/:aiid
 @method Delete
 @params botid,aiid
 @type Private.,,,,,,,,,,,,,,,,,,,,,,,,,
 @recieve 
 @desc
   for remove ai
   return status
   
   */
 
 Router.delete("/block-template/remove/:botid/:blockid/:templateid",passport.authenticate("jwt",{session:false}),botController.removeBlockTemplate)
 
 
 
 /*
 @url api/dashboard/ai/edit/:botid/:aiid
 @method POST
 @params botid,aiid
 @type Private
 @recieve ai Data
 @desc
   for edit ai
   return edited ai new data
   
   */
 Router.post("/block-template/edit/:botid/:blockid/:templateid",passport.authenticate("jwt",{session:false}),botController.editBlockTemplate)

 /* END BLOCK TEMPLATE ROUTE */
 /* START VARIABLES */

/*
 @url api/dashboard/ai/create/:botid
 @method Post
 @type Private
 @recieve 
 @params botid
 @desc
  for creating ai
  return created ai data
  
  */

 Router.post("/variable/create/:botid",passport.authenticate("jwt",{session:false}),botController.createVariable)



 /*
 @url api/dashboard/ai/remove/:botid/:aiid
 @method Delete
 @params botid,aiid
 @type Private.,,,,,,,,,,,,,,,,,,,,,,,,,
 @recieve 
 @desc
   for remove ai
   return status
   
   */
 
 Router.delete("/variable/remove/:botid/:variableid",passport.authenticate("jwt",{session:false}),botController.removeVariable)


 /* END VARIABLES */


 

 //START BOT ANALYSIS 
 /*
 @url api/dashboard/ai/remove/:botid/:aiid
 @method Delete
 @params botid,aiid
 @type Private.,,,,,,,,,,,,,,,,,,,,,,,,,
 @recieve 
 @desc
   for remove ai
   return status
   
   */
 
  Router.get("/analysis/get-all/:botid",passport.authenticate("jwt",{session:false}),botController.getAllAnalysis)












  /* START WELCOME TEMPLATE ROUTE */


/*
 @url api/dashboard/ai/create/:botid
 @method Post
 @type Private
 @recieve 
 @params botid
 @desc
  for creating ai
  return created ai data
  
  */

 Router.post("/welcome/create/:botid/",passport.authenticate("jwt",{session:false}),botController.createWelcomeTemplate)



 /*
 @url api/dashboard/ai/remove/:botid/:aiid
 @method Delete
 @params botid,aiid
 @type Private.,,,,,,,,,,,,,,,,,,,,,,,,,
 @recieve 
 @desc
   for remove ai
   return status
   
   */
 
 Router.delete("/welcome/remove/:botid/:templateid",passport.authenticate("jwt",{session:false}),botController.removeWelcomeTemplate)
 
 
 
 /*
 @url api/dashboard/ai/edit/:botid/:aiid
 @method POST
 @params botid,aiid
 @type Private
 @recieve ai Data
 @desc
   for edit ai
   return edited ai new data
   
   */
 Router.post("/welcome/edit/:botid/:templateid",passport.authenticate("jwt",{session:false}),botController.editWelcomeTemplate)


 
/*
 @url api/dashboard/ai/create/:botid
 @method Post
 @type Private
 @recieve 
 @params botid
 @desc
  for creating ai
  return created ai data
  
  */

 Router.get("/welcome/get/:botid/",passport.authenticate("jwt",{session:false}),botController.getWelcomeTemplates)

 /* END WELCOME TEMPLATE ROUTE */
module.exports=Router