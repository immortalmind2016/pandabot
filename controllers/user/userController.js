
var jwt = require('jsonwebtoken');
let User=require("../../model/User")
let axios=require("axios")




const create=(req,res,err)=>{
    const userData=req.body.data;
    console.log("SIGN UP")
        console.log(userData)
        User.findOne({facebook_id:userData.facebook_id},(err,user)=>{
          //  console.log(user)
            if(!!user){

            }else{
                let newUser=new User({
                    name:userData.name,
                    access_token:userData.access_token,
                    created_date:new Date(),
                    facebook_id:userData.facebook_id,
                    image_url:userData.image_url        
        
                })
                newUser.save((err,user)=>{
                    var token = jwt.sign({ 
                        ...user
                        
                     }, 'secret' , { expiresIn: '365d' });
                     res.json({success:true,token:"Bearer "+token})
                });
              
            }
        })
  
 
}
const get=(req,res,err)=>{


    res.json({success:true,user:req.user})
}
const login=(req,res,err)=>{
    const userData=req.body.user;
 //   console.log(userData)
    var token = jwt.sign({ 
        ...userData
        
     }, 'secret' );
     res.json({success:true,token:"Bearer "+token})
 
}
const pages=(req,res,err)=>{
    User.findOne({_id:req.user._id},(err,user)=>{
     //   console.log("PAGES ",user)
        if(!user){
            return res.sendStatus(404)
        }
        axios.get("https://graph.facebook.com/v4.0/me/accounts/?limit=500&access_token="+user.access_token).then(response=>{
            const pages=response.data.data;
             //console.log(response.data)
             console.log(response.data.data ,"DATAAAAAAAAAAAAAA")
            return res.json({pages})
        }).catch((e)=>{
            console.log("ERROR ",e)
        })
        
    })
}
module.exports={
    create,
    get,
    login,
    pages
}