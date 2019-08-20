const jwtStrategy=require("passport-jwt").Strategy;
const passport=require("passport");
const User=require("../model/User");
let opts = {}
const  ExtractJwt = require('passport-jwt').ExtractJwt;
const moment=require("moment")
const request=require('request')
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

module.exports=passport.use(new jwtStrategy(opts,(payload,done)=>{
  //  console.log("PAYLOAD ",payload)

        if(payload._doc){
          //  console.log("PAYLOAD")
            User.findOne({_id:payload._doc._id},(err,user)=>{
          //      console.log("USER ",user)
                if(err||!user)
                       return     done(err);
               else if(user){
                          return  done(null,user);
                }
            })
        }else{
            User.findOne({facebook_id: payload.userID}, function(err, user) {
                let date=moment().format("YY-DD-MM HH:mm");
                
                   if (user) {
              //     console.log("FIND USER ",moment().diff(moment(user.created_date,"YY-DD-MM HH:mm"),"days"))
                   
                    if(parseInt(moment().diff(moment(user.created_date,"YY-DD-MM HH:mm"), "days"))>=1){
                         request.get("https://graph.facebook.com/v3.3/oauth/access_token?grant_type=fb_exchange_token&client_id=156422488174385&client_secret=1baaf68c27455b351a8c8e26c201d6a0",{
                             qs:{
                                  fb_exchange_token: payload.accessToken,
                        grant_type:"fb_exchange_token",
                        client_id:"2245399952381834",
                        client_secret:"27ef343db9e7e20a644aaf16e0270592"
                 
           
                           }
                         },(err,response)=>{
                    //       console.log("SUCCESS RE1",response.body)
                    request.get("https://graph.facebook.com/v3.3/me/",{
                             qs:{
                               access_token:JSON.parse(response.body).access_token,
                               fields:"picture,name"
                           }
                         },(err,response2)=>{
         //   console.log("SUCCESS RE2",response.body)
           
              
                   user.created_date=date;
                      user.accessToken=JSON.parse(response.body).access_token;
                      user.avatar=JSON.parse(response2.body).picture.data.url
                      user.save((err,u)=>{
                     //   console.log(u,"DONE UPDATE")
               return done(null, u);
                      })
                 /*    User.findByIdAndUpdate(user._id,{accessToken:jwt_payload.payload.accessToken,avatar:JSON.parse(response.body).picture.data.url},(err,u)=>{
                   
                     })*/
                
                         })
           
           
               
                   //  user.save();
                      
                         })
           
                  
                     }else{
            
             console.log(user)
                             return done(null, user);
                     }
                 
                      
                   }
                   else{
                      // or you could create a new account
                       const newUser = new User();
                           (newUser.facebookId = payload.userID),
                       
                        
            
                         request.get("https://graph.facebook.com/v3.3/oauth/access_token",{
                             qs:{
                               fb_exchange_token: payload.accessToken,
                        grant_type:"fb_exchange_token",
                        client_id:"2245399952381834",
                        client_secret:"27ef343db9e7e20a644aaf16e0270592"
           
                           }
                         },(err,response)=>{     
                      //     console.log(response.body);
                           request.get("https://graph.facebook.com/v3.3/me/",{
                             qs:{
                                access_token:JSON.parse(response.body).access_token,
                               fields:"picture,name"
                           }
                         },(err,response2)=>{
                                 (newUser.name = JSON.parse(response2.body).name)
                      //     console.log("RES ",response2.body);
                             newUser.created_date=date;
                                  newUser.accessToken =JSON.parse(response.body).access_token;
                             newUser.avatar = JSON.parse(response2.body).picture.data.url;
                              newUser
                             .save()
                             .then(userData => {
                          
                     
                             
                             return done(null, userData)
                             
                             })
                             .catch(err => {

                           //     console.log("ERROR ",err)
                             });
                         })
           
                   })
           
                   
           
                   }
               });
        }
 
        
        /*else{
        let newUser=new User({
            name:payload.name,
            access_token:payload.access_token,
            created_date:new Date(),
            facebook_id:payload.facebook_id,
            image_url:payload.image_url        

        })
        newUser.save((err,user)=>{
         return   done(null,user);
        });
        } */  
    
    // my database Save Query
    
}))