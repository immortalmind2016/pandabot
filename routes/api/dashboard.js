

const Router=require("express").Router();
const Bot=require("../../model/Bot")
const passport=require("../../config/jwt_passport")
const dashboardController=require("../../controllers/dashboard/dashboardController")
/*
 @url api/dashboard/
 @method POST
 @type Private
 @params user data
 @desc
  for creating new bot\
  return created Bot Data
  
*/
Router.post("/",passport.authenticate("jwt",{session:false}),dashboardController.create)

/*
 @url api/dashboard/:id
 @method DELETE
 @type Private
 @desc
  for delete bot
  return status
  
*/
Router.delete("/:id",passport.authenticate("jwt",{session:false}),dashboardController.remove)

/*
 @url api/dashboard/:id
 @method POST
 @type Private
 @params Edited Data
 @desc
  edit bot 
  return status
  
*/
Router.post("/:id",passport.authenticate("jwt",{session:false}),dashboardController.edit)

/*
 @url api/dashboard/
 @method GET
 @type Private
 @desc
  get all bots
  return all bots array
  
*/
Router.get("/",passport.authenticate("jwt",{session:false}),dashboardController.get)
Router.get("/:botid",passport.authenticate("jwt",{session:false}),dashboardController.getBot)


/*
 @url api/dashboard/schedule/create/:botid
 @method Post
 @type Private
 @recieve 
 @params botid
 @desc
  for creating schedule
  return created schedule data
  
  */

//Router.post("/schedule/create/:botid",passport.authenticate("jwt",{session:false}),dashboardController.createSchedule)



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

//Router.delete("/schedule/remove/:botid/:scheduleid",passport.authenticate("jwt",{session:false}),dashboardController.removeSchedule)



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
//Router.post("/schedule/edit/:botid/:scheduleid",passport.authenticate("jwt",{session:false}),dashboardController.editSchedule)



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
//Router.get("/schedule/get-all/:botid/",passport.authenticate("jwt",{session:false}),dashboardController.getSchedulesAll)






/*
@url api/dashboard/send-message/:botid
@method post
@params botid
@type Private
@recieve 
@desc
  broadcast message
  return status
  
*/
Router.post("/send-message/:botid",passport.authenticate("jwt", { session: false }),dashboardController.sendMessage)

/*
@url api/dashboard/send-message/:botid
@method post
@params botid
@type Private
@recieve 
@desc
  broadcast message
  return status
  
*/
Router.post("/connect-page/:botid",passport.authenticate("jwt", { session: false }),dashboardController.connectPage)

/*
@url api/dashboard/send-message/:botid
@method post
@params botid
@type Private
@recieve 
@desc
  broadcast message
  return status
  
*/
Router.get("/connected-page/:botid",passport.authenticate("jwt", { session: false }),dashboardController.connectedPage)

/*
@url api/dashboard/send-message/:botid
@method post
@params botid
@type Private
@recieve 
@desc
  broadcast message
  return status
  
*/
Router.delete("/disconnect-page/:botid",passport.authenticate("jwt", { session: false }),dashboardController.disconnectPage)

module.exports=Router