const _ = require("lowdash");
const axios = require("axios");
const otpGenerator = require('otp-generator');
const {Otp} =  require('../models/otpModel');
const {User} = require("../models/user")

module.exports.sendCode =  async(req,res)=>{
     const user =await User.findOne({
       phone:req.body.phone
     });
     if(user) return res.status(400).send("User with the same phone number already registered!");
     const OTP = otpGenerator.generate(6,{
       digits:true,alphabets:false,upperCase:false, specialChars:false
     });
     const phone = req.body.phone;
     console.log(OTP);
     
     const otp = new Otp({phone:phone, otp:OTP});
     const result = await otp.save();
     return res.status(200).send("Otp sent successfully!")
   
   }