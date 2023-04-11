const express = require("express");

const {User, validate} = require("../models/user");
const UserVerification = require("../models/UserVerification")
const authRouter = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const{sendCode,verifyOtp } = require('../Controllers/userController')
var randtoken = require('rand-token')
const refreshTockens ={}
const crypto = import("crypto");
const Token = require("../models/UserVerification");
const path = require("path");

authRouter.route("/api/sendCode").post(sendCode);
authRouter.route("/api/sendCode/verifyOtp").post(verifyOtp);

//signup
authRouter.post("/api/signup", (req, res) => {
  const {
    name,
    lastname,
    email,
    password,
    birthday,
    username,
    number,
    country,
  } = req.body;

 User.findOne({ email }).then((existinguser)=>{
  if (existinguser) {
    return res
      .status(400)
      .json({ msg: "User with same email already exists!" });
  }else{
    bcrypt.hash(password, 8).then((hashedPassword) => {
      let user = new User({
        email,
        password: hashedPassword,
        name,
        lastname,
        birthday,
        username,
        number,
        country,
        verified: false,
      });
      user.save().then((result) => {
        console.log("user saved to db")
       sendVerificationEmail(result,res)
      }).catch((err) =>{
        res.json({
          status:"FAILED",
          message:"Signup failed",
        });
      })
    }).catch((err) => {
      res.json({
        status:"FAILED",
        message:"An error occured while hashing password"
      })
    })
  }
 })
});
const sendVerificationEmail = ({_id, email}, res) => {
  const currentUrl = "http://localhost:3000"
  const uniqueString = uuidv4() + _id;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject:"verify email",
    html: `<p>Verify you email address to complete the signup and login into your account. </p>
    <p><b>This link expires in 6 hours.</b></p>
    <p>Press <a href=${currentUrl + "/api/verify/" + _id + "/" + uniqueString}> here </a> to proceed</p> `
  };

  const saltRounds= 8;
  bcrypt.hash(uniqueString,saltRounds).then((hashedUniqueString)=>{
    const newVerification = new UserVerification({
      userId: _id,
      uniqueString:  hashedUniqueString,
      createdAt: Date.now(),
      expiresAt:Date.now() + 2160000,
    });
newVerification.save().then(()=>{
  transporter.sendMail(mailOptions).then(()=>{
    res.json({
      status:"PENDING",
      message:"verification email sent",
    })
  }).catch((error)=>{
    console.log(error)
    res.json({
      status:"Failed",
      message:"verification email failed",
    })
  })
}).catch((error) => {
  console.log(error);
  res.json({
    status:"Failed",
    message:"An error occured while hashing email data",
  })
})

  }).catch(()=>{
    reduce.json({
      status:"Failed",
      message:"An error occured while hashing email data",
    })
  })
}

authRouter.get("/api/verify/:userId/:uniqueString",(req,res)=>{
  let {userId, uniqueString} = req.params;
  UserVerification.find({userId}).then((result)=>{
   
   
    
    if(result.length > 0){
      
      const{expiresAt} = result[0];
const hashedUniqueString = result[0].uniqueString;


      if(expiresAt < Date.now()){
 
        UserVerification
        .deleteOne({userId})
        .then((result) => {
          User
          .deleteOne({id: userId})
          .then(()=>{
            let message = "Link has expired, please sign up again";
            res.redirect(`/user/verified/error=true&message=${message}`)
          }).catch((error)=>{
            let message = "Clearing user eith expired unique string failed ";
            res.redirect(`/api/verified/error=true&message=${message}`)
          })
        })
        .catch((error) => {
    console.log(error);
    let message = " An error occured while clearing expired user verification record";
    res.redirect(`/api/verified/error=true&message=${message}`)
  })
}else{
bcrypt.compare(uniqueString,hashedUniqueString)
.then(result =>{
  if(result){
    User
    .updateOne({_id: userId},{verified:true})
    .then(()=>{
      UserVerification.deleteOne({userId}).then(() =>{
        res.sendFile(path.join(__dirname,"../views/verified.html"))
      })
    })
    .catch(error=>{
      let message = "an error occured while updating user record to show verified ";
      res.redirect(`/api/verified/error=true&message=${message}`)
    })
  }else{
    let message = "Invalid verification details passed. Check your inbox";
    res.redirect(`/api/verified/error=true&message=${message}`)
  }
}).catch((error) => {
  let message = "an error occured while comparing unique strings  ";
      res.redirect(`/api/verified/error=true&message=${message}`)
})
}

    }else{
      let message = "Account record does't exist or has been verified already ";
      res.redirect(`/api/verified/error=true&message=${message}`)
    }
  }).catch((error)=>{
    console.log(error);
   let message = " An error occured while checking existing...";
   res.redirect(`/api/verified/error=true&message=${message}`)
  })

})

authRouter.get("/api/verified",(req,res)=>{
  res.sendFile(path.join(__dirname,"../views/verified.html"))
})

authRouter.post("/api/signin",(req, res) => {
 
    const { email, password } = req.body;
    
     User.find({ email })
     .then((data)=>{
      if(data){
        
        const hashedPassword = data[0].password;
        bcrypt.compare(password, hashedPassword).then((isMatch) =>{
          if (isMatch) {
            const token = jwt.sign({id:data._id},"passwordKey",{expiresIn: 300});
          var refreshTocken = randtoken.uid(256);
           refreshTockens[refreshTocken] = email
           res.json({status:"Success",
           message:"signin successful",
           data:token,refreshTocken:refreshTocken,...data._doc});
           
          }else{
            res.json({status:"Failed", message: "Incorrect password" });
          }
          
        }).catch(error => {
         res.json({ status:"Failed",
         message:"An error occured while comparing passwords"})
        })

        }else{

        res.json({
          status:"Failed",
          message:"Invalid credentials entered!"

        })
       }
      
      }).catch(error => {
        res.json({
          status:"Failed",
          message:"Invalid credentials "
        })
      })
    })
    
  

     


const nodemailer = require("nodemailer");
const {v4: uuidv4} = require("uuid");
const { start } = require("repl");
require('dotenv').config();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.PASSWORD,
  },
  secure: true,
})

transporter.verify((error, success) => {
  if(error){
    console.log(error)
  }else{
    console.log("Ready for message")
    console.log(success)
  }
})
/*validate token
authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token=req.header("x-auth-token");
    if(!token){
      return res.json(false);
    }

  const verified= jwt.verify(token,"passwordKey");

  if(!verified){
    return res.json(false);
  }
  
  const user = await User.findById(verified.id);

  if(!user){
    return res.json(false);
  }else{
    return res.json(true);
  }
     
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});*/

//get user data
authRouter.get('/', auth ,async(req,res)=>{
  const user = await User.findById(req.user);
 res.json({...user._doc,token:req.token})
});


 //update password
authRouter.post('/forgot-password',async(req,res)=>{
 const {email}=req.body;

//check if user exists
const user = await User.findOne({ email });
if(!user){
  console.log("User with this email does not exist!");
  return res.status(400).json({ msg: "User with this email does not exist!" });
}else{
 //user exist then send a onetime password link to the user email 
 const secret ='passwordKey' + user.password;
  const payload = {
    email: user.email,  
    id: user._id,
  };
 const token = jwt.sign(payload,secret,{expiresIn:'15m'});
  const link = `http://localhost:3000/reset-password/${user._id}/${token}`;
  console.log(link);
}
 
})

authRouter.get('/reset-password/:id/:token',async(req,res)=>{
  const {id,token}=req.params;
  //check if user id exists
  const user = await User.findOne({ id });
  if(!user){
    console.log("User with this id does not exist!");
    return res.status(400).json({ msg: "User with this id does not exist!" });
  }else{
    //user exist then check if token is valid
    const secret ='passwordKey' + user.password;
    try{
      const payload = jwt.verify(token,secret);
     
    }catch(error){
      console.log(error.toString());
    }
  }
})

authRouter.post('/reset-password/:id/:token',async(req,res)=>{
  const {id,token}=req.params;
  const {password}=req.body;
  const user = await User.findOne({ id });
  if(!user){
    console.log("User with this id does not exist!");
    return res.status(400).json({ msg: "User with this id does not exist!" });
  }else{
    //user exist then check if token is valid
    const secret ='passwordKey' + user.password;
    try{
      const payload = jwt.verify(token,secret);
      //update password
      const hashedPassword = await bcrypt.hash(password, 8);
      payload.password=hashedPassword;
      await user.save();
      res.json(user);
    }catch(error){
      console.log(error.toString());
    }
  }
})


//update username
authRouter.post('/update-username',async(req,res)=>{
 const {username}=req.body;
 const user = await User.findOne({ username });
 
})






// authRouter.patch('/update/:email',async(req,res)=>{
// try {
//  User.findOneAndUpdate({email:req.params.email},{$set:{password:req.body.password}},{})
// } catch (error) {
//   console.log(error.toString());
// }
// })



// otpLogin = async (req, res, next) => {
//   createOtp(req.body, (err, results) => {
//     if (err) {
//       return next(err);
//     }
//     return res.status(200).send({ message: "Success", data: results });
//   });
// };


// otpVerify = async (req, res, next) => {
//   verifyOtp(req.body, (err, results) => {
//     if (err) {
//       return next(err);
//     }
//     return res.status(200).send({ message: "Success", data: results });
//   });
// }

//otp login
// authrouter.post('/otpLogin',otpLogin = async (req, res, next) => {
//   createOtp(req.body, (err, results) => {
//     if (err) {
//       return next(err);
//     }
//     return res.status(200).send({ message: "Success", data: results });
//   });
// });
module.exports = authRouter;
