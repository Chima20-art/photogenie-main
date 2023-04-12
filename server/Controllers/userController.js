require('dotenv').config()
const _ = require("lodash");
const otpGenerator = require('otp-generator');
const {Otp} =  require('../models/otpModel');
var bcrypt = require('bcryptjs');
const UserVerification = require('../models/UserVerification')
const { User } = require('../models/user')
const jwt = require('jsonwebtoken')
var randtoken = require('rand-token')
const refreshTockens = {}
const nodemailer = require("nodemailer");
var bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid')


let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.PASSWORD,
  },
  secure: true,
})

transporter.verify((error, success) => {
  if (error) {
      console.log(error)
  } else {
      console.log('Ready for message')
      console.log(success)
  }
})

module.exports.signup = (req,res) => {
    {
        const {
            name,
            lastname,
            email,
            password,
            birthday,
            username,
            number,
            country,
        } = req.body
    
        User.findOne({ email }).then((existinguser) => {
            if (existinguser) {
                return res
                    .status(400)
                    .json({ msg: 'User with same email already exists!' })
            } else {
                bcrypt
                    .hash(password, 8)
                    .then((hashedPassword) => {
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
                        })
                        user.save()
                            .then((result) => {
                                console.log('user saved to db')
    
                                sendVerificationEmail(result, res)
                            })
                            .catch((err) => {
                                console.log(err)
                                res.json({
                                    status: 'FAILED',
                                    message: 'An error occured while saving user account',
                                })
                            })
                    })
                    .catch((err) => {
                        res.json({
                            status: 'FAILED',
                            message: 'An error occured while hashing password',
                        })
                    })
            }
        })
    }
}
const sendVerificationEmail = ({ _id, email }, res) => {
    const uniqueString = uuidv4() + _id
    const baseUrl = 'http://localhost:3000' // backend url
    const verifyUrl = baseUrl + '/api/verify/' + _id + '/' + uniqueString
    console.log('verifyUrl', verifyUrl)
  
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'verify email',
        html: `<p>Verify you email address to complete the signup and login into your account. </p>
    <p><b>This link expires in 6 hours.</b></p>
    <p>Press <a href=${verifyUrl}> here </a> to proceed</p> `,
    }
  
    const saltRounds = 8
    bcrypt
        .hash(uniqueString, saltRounds)
        .then((hashedUniqueString) => {
            const newVerification = new UserVerification({
                userId: _id,
                uniqueString: hashedUniqueString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 2160000,
            })
            newVerification
                .save()
                .then(() => {
                     transporter
                        .sendMail(mailOptions)
                         .then(() => {
                             res.json({
                                 status: 'PENDING',
                                 message: 'verification email sent',
                            })
                        })
                        .catch((error) => {
                           console.log(error)
                            res.json({
                                status: 'Failed',
                               message: 'Couldnt save verification email data ',
                            })
                        })
                })
                .catch((error) => {
                    console.log(error)
                    res.json({
                        status: 'Failed',
                        message: 'An error occured while hashing email data',
                    })
                })
        })
        .catch((eroor) => {
            res.json({
                status: 'Failed',
                message: 'An error occured while hashing email data',
            })
        })
  }
module.exports.signin = (req,res) => {
    const { email, password } = req.body

    User.find({ email })
        .then((data) => {
            if (data) {
                const hashedPassword = data[0].password
                bcrypt
                    .compare(password, hashedPassword)
                    .then((isMatch) => {
                        console.log(data);
                        if (isMatch) {
                            const token = jwt.sign(
                                { id: data._id },
                                'passwordKey',
                                { expiresIn: 300 }
                            )
                            var refreshTocken = randtoken.uid(256)
                            refreshTockens[refreshTocken] = email
                            const userData = data[0]
                            res.json({
                                status: 'Success',
                                message: 'signin successful',
                                token: token,
                                refreshTocken: refreshTocken,
                                userData,
                            })
                        } else {
                            res.json({
                                status: 'Failed',
                                message: 'Incorrect password',
                            })
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        res.json({
                            status: 'Failed',
                            message:
                                'An error occured while comparing passwords',
                        })
                    })
            } else {
                res.json({
                    status: 'Failed',
                    message: 'Invalid credentials entered!',
                })
            }
        })
        .catch((error) => {
            res.json({
                status: 'Failed',
                message: 'Invalid credentials ',
            })
        })
}

module.exports.verify =(req,res) => {
    let { userId, uniqueString } = req.params
    UserVerification.find({ userId })
        .then((result) => {
            if (result.length > 0) {
                const { expiresAt } = result[0]
                const hashedUniqueString = result[0].uniqueString

                if (expiresAt < Date.now()) {
                    UserVerification.deleteOne({ userId })
                        .then((result) => {
                            User.deleteOne({ id: userId })
                                .then(() => {
                                    let message =
                                        'Link has expired, please sign up again'
                                    res.redirect(
                                        `/api/verified?error=true&message=${message}`
                                    )
                                })
                                .catch((error) => {
                                    let message =
                                        'Clearing user eith expired unique string failed '
                                    res.redirect(
                                        `/api/verified?error=true&message=${message}`
                                    )
                                })
                        })
                        .catch((error) => {
                            console.log(error)
                            let message =
                                ' An error occured while clearing expired user verification record'
                            res.redirect(
                                `/api/verified?error=true&message=${message}`
                            )
                        })
                } else {
                    bcrypt
                        .compare(uniqueString, hashedUniqueString)
                        .then((result) => {
                            if (result) {
                                User.updateOne(
                                    { _id: userId },
                                    { verified: true }
                                )
                                    .then(() => {
                                        UserVerification.deleteOne({
                                            userId,
                                        }).then(() => {
                                            let message = 'Email Verified'
                                            let deeplink =
                                                'http://localhost:3000'
                                            res.redirect(
                                                `/api/verified?message=${message}&link=${deeplink}`
                                            )
                                        })
                                    })
                                    .catch((error) => {
                                        let message =
                                            'an error occured while updating user record to show verified '
                                        res.redirect(
                                            `/api/verified?error=true&message=${message}`
                                        )
                                    })
                            } else {
                                let message =
                                    'Invalid verification details passed. Check your inbox'
                                res.redirect(
                                    `/api/verified?error=true&message=${message}`
                                )
                            }
                        })
                        .catch((error) => {
                            let message =
                                'an error occured while comparing unique strings  '
                            res.redirect(
                                `/api/verified?error=true&message=${message}`
                            )
                        })
                }
            } else {
                let message =
                    "Account record does't exist or has been verified already "
                res.redirect(`/api/verified?error=true&message=${message}`)
            }
        })
        .catch((error) => {
            console.log(error)
            let message = ' An error occured while checking existing...'
            res.redirect(`/api/verified?error=true&message=${message}`)
        })
}
module.exports.sendCode =  async(req,res)=>{
     const user =await User.findOne({
       number:req.body.number
     });
     if(user) return res.status(400).send("User with the same phone number already registered!");
     const OTP = otpGenerator.generate(6,{
       digits:true,alphabets:false,upperCase:false, specialChars:false
     });
     const number = req.body.number;
     console.log(OTP);
     const otp = new Otp({ number: number, otp: OTP });
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
