const express = require("express");
const User = require("../models/user");
const authRouter = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");


//signup
authRouter.post("/api/signup", async (req, res) => {
  try {
    //get data from the client
    const {
      name,
      lastname,
      email,
      password,
      birthday,
      username,
      phone,
      country,
    } = req.body;

    //post that data in database
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res
        .status(400)
        .json({ msg: "User with same email is already exists!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      email,
      password: hashedPassword,
      name,
      lastname,
      birthday,
      username,
      phone,
      country
    });

    user = await user.save();
    res.json(user);

    //return the data to the user
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//signin
authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User with this email does not exist!" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

   const token = jwt.sign({id:user._id},"passwordKey");
    res.json({token,...user._doc});
     
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//validate token
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
});




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
      const hashedPassword = await bcryptjs.hash(password, 8);
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
