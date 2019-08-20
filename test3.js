var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: "434132057072183",
    clientSecret: "e29d2bd99f9b1088175fb989fec2cae3",
    callbackURL: "https://b72d127d.ngrok.io/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {

           done(null, {accessToken});
  }
));


const express=require("express");
const app=express();
     app.use(passport.initialize());
        app.use(passport.session());


app.get('/auth/facebook', passport.authenticate('facebook'));

app.get("/home",(req,res,err)=>{

      
    

     return  res.send("HOME")

})
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' ,
                                      session: false
}));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.listen(5000)



console.log("Mohamed Salah")