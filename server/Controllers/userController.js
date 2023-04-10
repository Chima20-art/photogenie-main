const _ = require("lowdash");
const axios = require("axios");
const otpGenerator = require('otp-generator');
const {Otp} =  require('../models/otpModel');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const User = require("../models/user")

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
     const otp = new Otp({ number: phone, otp: OTP });
     const salt = await bcrypt.genSalt(10)
     otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
     return res.status(200).send("Otp sent successfully!")
   
   }

   module.exports.verifyOtp = async (req, res) => {
    const otpHolder = await Otp.find({
        number: req.body.number
    });
    if (otpHolder.length === 0) return res.status(400).send("You use an Expired OTP!");
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    if (rightOtpFind.number === req.body.number && validUser) {
        const user = new User(_.pick(req.body, ["number"]));
        const token = user.generateJWT();
        const result = await user.save();
        const OTPDelete = await Otp.deleteMany({
            number: rightOtpFind.number
        });
        return res.status(200).send({
            message: "User Registration Successfull!",
            token: token,
            data: result
        });
    } else {
        return res.status(400).send("Your OTP was wrong!")
    }
}