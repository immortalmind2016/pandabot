
const FacebookStrategy=require("passport-facebook").Strategy;
const passport=require("passport");
let User=require("../model/User")
const axios=require("axios")

module.exports=passport.use(new FacebookStrategy({
    clientID: "2245399952381834",
    clientSecret: "27ef343db9e7e20a644aaf16e0270592",
    callbackURL: "https://pandabotbeta2.herokuapp.com/api/user/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOne({facebook_id:profile.id},(err,user)=>{
      /*  axios.get(`
        https://graph.facebook.com/
        oauth/access_token?  
        grant_type=fb_exchange_token&           
        client_id=2245399952381834&
        client_secret=27ef343db9e7e20a644aaf16e0270592&
        fb_exchange_token=${accessToken} `)*/
        console.log(user)
        if(!!user){
          user.access_token=accessToken;
          
            return cb(null, user);

        }else{
        
            let newUser=new User({
                name:profile.displayName,
                access_token:accessToken,
                created_date:new Date(),
                facebook_id:profile.id,
                image_url:`https://graph.facebook.com/${profile.id}/picture?type=large`    
    
            })
            newUser.save((err,user)=>{
                return cb(null, user);

            });
          
        }
    })
   
  }
));