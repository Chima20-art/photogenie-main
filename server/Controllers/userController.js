require('dotenv').config();
const _ = require('lodash');
const otpGenerator = require('otp-generator');
const { Otp } = require('../models/otpModel');
var bcrypt = require('bcryptjs');
const UserVerification = require('../models/UserVerification');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const PasswordReset = require('../models/PasswordReset');
const EmailOtp = require('../models/emailOtp');
const { verifyRefresh,generateRandomNumber} = require("../middlewares/helper.js");





module.exports.signup = (req, res) => {
    const message = {
        subject: 'Signup verification',
        text: 'Use the Code below to rverify your email'
    };
    const {
        name,
        lastname,
        email,
        password,
        birthday,
        username,
        number,
        country
    } = req.body;

    if (
        (name, lastname, email, password, birthday, username, number, country)
    ) {
        User.findOne({ email }).then((existinguser) => {
            if (existinguser) {
                res.json({
                    status: 'Failed',
                    message: 'Email already exists'
                });
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
                            verified: false
                        });
                        user.save()
                            .then((result) => {
                                console.log('user saved to db');

                                sendSignupOtp(result, message, res);
                            })
                            .catch((err) => {
                                console.log(err);
                                res.json({
                                    status: 'Failed',
                                    message:
                                        'An error occured while saving user account'
                                });
                            });
                    })
                    .catch((err) => {
                        res.json({
                            status: 'Failed',
                            message: 'An error occured while hashing password'
                        });
                    });
            }
        });
    } else {
        res.json({
            status: 'Failed',
            message: 'Please fill all fields'
        });
    }
};

module.exports.signin = (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then((data) => {
            if (data) {
                const hashedPassword = data.password;
                bcrypt
                    .compare(password, hashedPassword)
                    .then((isMatch) => {
                        console.log(data);
                        if (isMatch) {
                            const accessToken = jwt.sign(
                                { id: data._id },
                                'accessSecret',
                                { expiresIn: "2m" }
                            );
                            const refreshToken = jwt.sign(
                                { email:email },
                                "refreshSecret",
                                { expiresIn: "10m"}
                                );
                    
                            const userData = data;
                            res.json({
                                status: 'Success',
                                message: 'signin successful',
                                token: accessToken,
                                refreshToken: refreshToken,
                                userData
                            });
                        } else {
                            res.json({
                                status: 'Failed',
                                message: 'Incorrect password'
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        res.json({
                            status: 'Failed',
                            message:
                                'An error occured while comparing passwords'
                        });
                    });
            } else {
                res.json({
                    status: 'Failed',
                    message: 'Invalid credentials entered!'
                });
            }
        })
        .catch((error) => {
            res.json({
                status: 'Failed',
                message: 'Invalid credentials '
            });
        });
};

//signout
module.exports.signout = (req, res) => {
    const { email, refreshToken } = req.body;
  
    try {
      const isValid = verifyRefresh(email, refreshToken);
  
      if (isValid) {
        // Remove refresh token from response body of sign-in endpoint
        const userData = { ...req.body.userData };
        delete userData.refreshToken;
  
        res.status(200).json({ success: true, message: "Signout successful" });
      } else {
        res.status(401).json({ success: false, message: "Invalid token, signout failed" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "An error occurred during signout" });
    }
  };
//refresh Token
module.exports.refresh = (req,res) => {
    const { email, refreshToken } = req.body;
    const isValid = verifyRefresh(email, refreshToken);
    if (!isValid) {
    return res
    .status(401)
    .json({ success: false, error: "Invalid token,try login again" });
    }
    const accessToken = jwt.sign({ email: email }, "accessSecret", {
    expiresIn: "2m",
    });
    console.log(accessToken)
    return res.status(200).json({ success: true, accessToken });
   
}

//verify Email
module.exports.verifyEmail = (req, res) => {
    let { userId, uniqueString } = req.params;
    UserVerification.find({ userId })
        .then((result) => {
            if (result.length > 0) {
                //user verification record exists so we proceed
                const { expiresAt } = result[0];
                const hashedUniqueString = result[0].uniqueString;

                if (expiresAt < Date.now()) {
                    //record has expired so we delete it
                    UserVerification.deleteOne({ userId })
                        .then((result) => {
                            User.deleteOne({ id: userId })
                                .then(() => {
                                    let message =
                                        'Link has expired, please sign up again';
                                    res.redirect(
                                        `/api/verified?error=true&message=${message}`
                                    );
                                })
                                .catch((error) => {
                                    let message =
                                        'Clearing user eith expired unique string failed ';
                                    res.redirect(
                                        `/api/verified?error=true&message=${message}`
                                    );
                                });
                        })
                        .catch((error) => {
                            console.log(error);
                            let message =
                                ' An error occured while clearing expired user verification record';
                            res.redirect(
                                `/api/verified?error=true&message=${message}`
                            );
                        });
                } else {
                    //valid record exists so we validate the user string
                    //compare first
                    bcrypt
                        .compare(uniqueString, hashedUniqueString)
                        .then((result) => {
                            if (result) {
                                //strings match
                                User.updateOne(
                                    { _id: userId },
                                    { verified: true }
                                )
                                    .then(() => {
                                        UserVerification.deleteOne({
                                            userId
                                        }).then(() => {
                                            let message = 'Email Verified';
                                            let deeplink =
                                                'http://localhost:3000';
                                            res.redirect(
                                                `/api/verified?message=${message}&link=${deeplink}`
                                            );
                                        });
                                    })
                                    .catch((error) => {
                                        let message =
                                            'an error occured while updating user record to show verified ';
                                        res.redirect(
                                            `/api/verified?error=true&message=${message}`
                                        );
                                    });
                            } else {
                                //existing record but incorrect verification details passed
                                let message =
                                    'Invalid verification details passed. Check your inbox';
                                res.redirect(
                                    `/api/verified?error=true&message=${message}`
                                );
                            }
                        })
                        .catch((error) => {
                            let message =
                                'an error occured while comparing unique strings  ';
                            res.redirect(
                                `/api/verified?error=true&message=${message}`
                            );
                        });
                }
            } else {
                //user verification record does't exist
                let message =
                    "Account record does't exist or has been verified already ";
                res.redirect(`/api/verified?error=true&message=${message}`);
            }
        })
        .catch((error) => {
            console.log(error);
            let message = ' An error occured while checking existing...';
            res.redirect(`/api/verified?error=true&message=${message}`);
        });
};

module.exports.sendCode = async (req, res) => {
    const user = await User.findOne({
        number: req.body.number
    });
    if (user)
        return res
            .status(400)
            .send('User with the same phone number already registered!');
    const OTP = otpGenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false
    });
    const number = req.body.number;
    console.log(OTP);
    const otp = new Otp({ number: number, otp: OTP });
    const salt = await bcrypt.genSalt(10);
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
    return res.status(200).send('Otp sent successfully!');
};

module.exports.verifyOtp = async (req, res) => {
    const otpHolder = await Otp.find({
        number: req.body.number
    });
    if (otpHolder.length === 0)
        return res.status(400).send('You use an Expired OTP!');
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    if (rightOtpFind.number === req.body.number && validUser) {
        const user = new User(_.pick(req.body, ['number']));
        const token = user.generateJWT();
        const result = await user.save();
        const OTPDelete = await Otp.deleteMany({
            number: rightOtpFind.number
        });
        return res.status(200).send({
            message: 'User Registration Successfull!',
            token: token,
            data: result
        });
    } else {
        return res.status(400).send('Your OTP was wrong!');
    }
};

module.exports.requestPasswordReset = (req, res) => {
    const { email, redirectUrl } = req.body;
    //check if email exists
    User.find({ email })
        .then((data) => {
            if (data.length) {
                //user exists
                if (!data[0].verified) {
                    res.json({
                        status: 'Failed',
                        message:
                            "Email hasn't  been verified yet. Check your inbox"
                    });
                } else {
                    //send verification Email
                    sendResetEmail(data[0], redirectUrl, res);
                }
            } else {
                res.json({
                    status: 'Failed',
                    message: 'No account with the supplied email exists'
                });
            }
        })
        .catch((erorr) => {
            console.log(erorr);
            res.json({
                status: 'Failed',
                message: 'An error occuured while checking for existing user'
            });
        });
};

module.exports.resetPassword = (req, res) => {
    let { userId, resetString, newPassword } = req.body;
    PasswordReset.find({ userId })
        .then((result) => {
            if (result.length > 0) {
                const { expiresAt } = result[0];
                const hashedResetString = result[0].resetString;
                if (expiresAt < Date.now()) {
                    PasswordReset.deleteOne({ userId })
                        .then(() => {
                            res.json({
                                status: 'Failed',
                                message: 'Password reset link has expired.'
                            });
                        })
                        .catch((error) => {
                            res.json({
                                status: 'Failed',
                                message: 'Clearing password reset record failed'
                            });
                        });
                } else {
                    bcrypt
                        .compare(resetString, hashedResetString)
                        .then((result) => {
                            if (result) {
                                const saltRounds = 10;
                                bcrypt
                                    .hash(newPassword, saltRounds)
                                    .then((hashedNewPassword) => {
                                        //update user function
                                        User.updateOne(
                                            { _id: userId },
                                            { password: hashedNewPassword }
                                        )
                                            .then(() => {
                                                //update complete, now delete reset record
                                                PasswordReset.deleteOne({
                                                    userId
                                                })
                                                    .then(() => {
                                                        res.json({
                                                            status: 'SUCCESS',
                                                            message:
                                                                'Password has been reset successfully.'
                                                        });
                                                    })
                                                    .catch((error) => {
                                                        res.json({
                                                            status: 'Failed',
                                                            message:
                                                                'An error occured while finalizing password rest.'
                                                        });
                                                    });
                                            })
                                            .catch((error) => {
                                                res.json({
                                                    status: 'Failed',
                                                    message:
                                                        'Updating user password faailed'
                                                });
                                            });
                                    })
                                    .catch((error) => {
                                        res.json({
                                            status: 'Failed',
                                            message:
                                                'An error occured while hashing new password.'
                                        });
                                    });
                            } else {
                                res.json({
                                    status: 'Failed',
                                    message:
                                        'Invalid password reset details passed'
                                });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            res.json({
                                status: 'Failed',
                                message:
                                    'Comparing password reset strings failed.'
                            });
                        });
                }
            } else {
                // Password reset record does'nt exist
                res.json({
                    status: 'Failed',
                    message: 'Password reset record request not found'
                });
            }
        })
        .catch((error) => {
            console.log(error);
            res.json({
                status: 'Failed',
                message: 'Checking for existing password reset record failed'
            });
        });
};

//send password reset email
const sendResetEmail = ({ _id, email }, res) => {
    const resetString = uuidv4() + _id;
    const frontendUrl = redirectUrl + '/' + _id + '/' + resetString;
    console.log('frontendUrl', frontendUrl);

    //clear all reset existing records

    PasswordReset.deleteMany({ userId: _id })
        .then((result) => {
            //Reset Records deleted successfully
            //we send Email
            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: email,
                subject: 'Password Reset',
                html: `<p>Use the Link below to reset password </p>
        <p><b>This link expires in 60 mins.</b></p>
        <p>Press <a href=${frontendUrl}> here </a> to proceed</p> `
            };

            const saltRounds = 10;
            bcrypt
                .hash(resetString, saltRounds)
                .then((hashedResetString) => {
                    const newPasswordReset = new PasswordReset({
                        userId: _id,
                        resetString: hashedResetString,
                        createdAt: Date.now(),
                        expiresAt: Date.now() + 36000000
                    });
                    newPasswordReset
                        .save()
                        .then(() => {
                            transporter
                                .sendMail(mailOptions)
                                .then(() => {
                                    res.json({
                                        status: 'PENDING',
                                        message: 'Password reset email sent!'
                                    });
                                })
                                .catch((error) => {
                                    console.log(error);
                                    res.json({
                                        status: 'Failed',
                                        message: 'Password reset email failed'
                                    });
                                });
                        })
                        .catch((error) => {
                            console.log(error);
                            res.json({
                                status: 'Failed',
                                message: "Couldn't save password reset data!"
                            });
                        });
                })
                .catch((error) => {
                    console.log(error);
                    res.json({
                        status: 'Failed',
                        message:
                            'An error occured while hashing the password reset data!'
                    });
                });
        })
        .catch((error) => {
            console.log(error);
            res.json({
                status: 'Failed',
                message: 'Error occured while clearing existing reset records'
            });
        });
};



module.exports.requestPasswordResetByDigits = (req, res) => {
    const message = {
        subject: 'Reset Password',
        text: 'Use the Code below to reset password'
    };
    const { email } = req.body;
    if (email) {
        //check if email exists
        User.findOne({ email })
            .then((data) => {
                if (data) {
                    //user doesnt  exists
                    if (!data.verified) {
                        res.json(
                            {
                                status: 'Failed',
                                message:
                                    "Email hasn't  been verified yet. Check your inbox"
                            },
                            400
                        );
                    } else {
                        //send verification Email
                        console.log(res);
                        sendDigitsEmail(data, message, res);
                    }
                } else {
                    res.json({
                        status: 'Failed',
                        message: 'No account with the supplied email exists'
                    });
                }
            })
            .catch((erorr) => {
                console.log(erorr);
                res.json({
                    status: 'Failed',
                    message:
                        'An error occuured while checking for existing user'
                });
            });
    } else {
        res.json({
            status: 'Failed',
            message: "email n'existe pas."
        });
    }
};
const sendDigitsEmail = ({ _id, email }, message, res) => {
    let verificationNumber = generateRandomNumber();
    console.log('verificationNumber', verificationNumber);

    //clear all reset existing records

    PasswordReset.deleteMany({ userId: _id })
        .then((result) => {
            //Reset Records deleted successfully
            //we send Email
            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: email,
                subject: `${message.subject}`,
                html: `<p>${message.text} </p>
        <p><b>${verificationNumber}</b></p>`
            };

            const saltRounds = 10;
            bcrypt
                .hash(verificationNumber.toString(), saltRounds)
                .then((hashedResetString) => {
                    console.log(hashedResetString);
                    const newPasswordReset = new PasswordReset({
                        userId: _id,
                        resetString: hashedResetString,
                        createdAt: Date.now(),
                        expiresAt: Date.now() + 36000000,
                        verified: false
                    });
                    newPasswordReset
                        .save()
                        .then(() => {
                            transporter
                                .sendMail(mailOptions)
                                .then(() => {
                                    res.json({
                                        status: 'PENDING',
                                        message: 'Password reset email sent!'
                                    });
                                })
                                .catch((error) => {
                                    console.log(error);
                                    res.json({
                                        status: 'Failed',
                                        message: 'Password reset email failed'
                                    });
                                });
                        })
                        .catch((error) => {
                            console.log(error);
                            res.json({
                                status: 'Failed',
                                message: "Couldn't save password reset data!"
                            });
                        });
                })
                .catch((error) => {
                    console.log(error);
                    res.json({
                        status: 'Failed',
                        message:
                            'An error occured while hashing the password reset data!'
                    });
                });
        })
        .catch((error) => {
            console.log(error);
            res.json({
                status: 'Failed',
                message: 'Error occured while clearing existing reset records'
            });
        });
};
const sendSignupOtp = ({ _id, email }, message, res) => {
    let verificationNumber = generateRandomNumber();
    console.log('verificationNumber', verificationNumber);

    //clear all reset existing records

    EmailOtp.deleteMany({ userId: _id })
        .then((result) => {
            //Reset Records deleted successfully
            //we send Email
            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: email,
                subject: `${message.subject}`,
                html: `<p>${message.text} </p>
        <p><b>${verificationNumber}</b></p>`
            };

            const saltRounds = 10;
            bcrypt
                .hash(verificationNumber.toString(), saltRounds)
                .then((hashedResetString) => {
                    console.log(hashedResetString);
                    const newEmailOtp = new EmailOtp({
                        userId: _id,
                        resetString: hashedResetString,
                        createdAt: Date.now(),
                        expiresAt: Date.now() + 36000000,
                        verified: false
                    });
                    newEmailOtp
                        .save()
                        .then(() => {
                            transporter
                                .sendMail(mailOptions)
                                .then(() => {
                                    res.json({
                                        status: 'PENDING',
                                        message: 'Password reset email sent!'
                                    });
                                })
                                .catch((error) => {
                                    console.log(error);
                                    res.json({
                                        status: 'Failed',
                                        message: 'Password reset email failed'
                                    });
                                });
                        })
                        .catch((error) => {
                            console.log(error);
                            res.json({
                                status: 'Failed',
                                message: "Couldn't save password reset data!"
                            });
                        });
                })
                .catch((error) => {
                    console.log(error);
                    res.json({
                        status: 'Failed',
                        message:
                            'An error occured while hashing the password reset data!'
                    });
                });
        })
        .catch((error) => {
            console.log(error);
            res.json({
                status: 'Failed',
                message: 'Error occured while clearing existing reset records'
            });
        });
};
module.exports.verifySignupOtp = (req, res) => {
    let { email, otp } = req.body;
    User.findOne({ email })
        .then((data) => {
            if (data) {
                //console.log(data)
                EmailOtp.findOne({ userId: data._id })
                    .then((emailOtpRecord) => {
                        console.log(emailOtpRecord);

                        bcrypt
                            .compare(otp, emailOtpRecord.resetString)
                            .then((result) => {
                                console.log('result', result);
                                if (result) {
                                    User.updateOne(
                                        { email },
                                        { verified: true }
                                    )
                                        .then(() => {
                                            res.json({
                                                status: 'Success',
                                                message:
                                                    'Otp verified successfuly.'
                                            });
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                            res.json({
                                                status: 'Failed',
                                                message:
                                                    'An error occured while updating PasswordReset.'
                                            });
                                        });
                                } else {
                                    res.json({
                                        status: 'Failed',
                                        message: 'Otp does not match!'
                                    });
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                                res.json({
                                    status: 'Failed',
                                    message:
                                        'An error occured while comparing otp.'
                                });
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                        res.json({
                            status: 'Failed',
                            message:
                                'An error occured while trying to find PasswordReset.'
                        });
                    });
            } else {
                res.json({
                    status: 'Failed',
                    message: 'User is not in db.'
                });
            }
        })
        .catch((error) => {
            console.log(error);
            res.json({
                status: 'Failed',
                message: 'An error occured while trying to find the user in db.'
            });
        });
};
module.exports.verifyEmailOtp = (req, res) => {
    let { email, otp } = req.body;
    User.find({ email })
        .then((data) => {
            if (data.length > 0) {
                //console.log(data)
                PasswordReset.findOne({ userId: data[0]._id })
                    .then((passwordResetRecord) => {
                        console.log(passwordResetRecord);

                        bcrypt
                            .compare(otp, passwordResetRecord.resetString)
                            .then((result) => {
                                console.log('result', result);
                                if (result) {
                                    PasswordReset.updateOne(
                                        { userId: data[0]._id },
                                        { verified: true }
                                    )
                                        .then((rest) => {
                                            //console.log(rest)
                                            res.json({
                                                status: 'Success',
                                                message:
                                                    'Otp verified successfuly.'
                                            });
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                            res.json({
                                                status: 'Failed',
                                                message:
                                                    'An error occured while updating PasswordReset.'
                                            });
                                        });
                                } else {
                                    res.json({
                                        status: 'Failed',
                                        message: 'Otp does not match!'
                                    });
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                                res.json({
                                    status: 'Failed',
                                    message:
                                        'An error occured while comparing otp.'
                                });
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                        res.json({
                            status: 'Failed',
                            message:
                                'An error occured while trying to find PasswordReset.'
                        });
                    });
            } else {
                res.json({
                    status: 'Failed',
                    message: 'User is not in db.'
                });
            }
        })
        .catch((error) => {
            console.log(error);
            res.json({
                status: 'Failed',
                message: 'An error occured while trying to find the user in db.'
            });
        });
};
module.exports.resetPasswordByDigits = (req, res) => {
    let { email, newPassword } = req.body;
    if (newPassword) {
        const saltRounds = 10;
        User.find({ email })
            .then((data) => {
                if (data.length > 0) {
                    //console.log(data)
                    PasswordReset.findOne({ userId: data[0]._id })
                        .then((passwordResetRecord) => {
                            if (passwordResetRecord) {
                                if (passwordResetRecord.verified) {
                                    if (
                                        passwordResetRecord.expiresAt >
                                        Date.now()
                                    ) {
                                        bcrypt
                                            .hash(newPassword, saltRounds)
                                            .then((hashedNewPassword) => {
                                                User.updateOne(
                                                    { email: email },
                                                    {
                                                        password:
                                                            hashedNewPassword
                                                    }
                                                )
                                                    .then(() => {
                                                        //update complete, now delete reset record
                                                        PasswordReset.deleteMany(
                                                            {
                                                                userId: data[0]
                                                                    ._id
                                                            }
                                                        )
                                                            .then(() => {
                                                                res.json({
                                                                    status: 'Success',
                                                                    message:
                                                                        'Password has been reset successfully.'
                                                                });
                                                            })
                                                            .catch((error) => {
                                                                res.json({
                                                                    status: 'Failed',
                                                                    message:
                                                                        'An error occured while finalizing password rest.'
                                                                });
                                                            });
                                                    })
                                                    .catch((error) => {
                                                        console.log(error);
                                                        res.json({
                                                            status: 'Failed',
                                                            message:
                                                                'An error occured while trying to find user in db.'
                                                        });
                                                    });
                                            })
                                            .catch((error) => {
                                                console.log(error);
                                                res.json({
                                                    status: 'Failed',
                                                    message:
                                                        'An error occured while hashing newPassword.'
                                                });
                                            });
                                    } else {
                                        res.json({
                                            status: 'Failed',
                                            message:
                                                'passwoedResetRecord expired.'
                                        });
                                    }
                                } else {
                                    res.json({
                                        status: 'Failed',
                                        message: 'otp not verified.'
                                    });
                                }
                            } else {
                                res.json({
                                    status: 'Failed',
                                    message: 'passwordResetRecord not found.'
                                });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            res.json({
                                status: 'Failed',
                                message:
                                    'An error occured while trying to find PasswordReset.'
                            });
                        });
                } else {
                    res.json({
                        status: 'Failed',
                        message: 'User is not in db.'
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                res.json({
                    status: 'Failed',
                    message:
                        'An error occured while trying to find the user in db.'
                });
            });
    } else {
        res.json({
            status: 'Failed',
            message: "Can't find newPassword."
        });
    }
};

module.exports.verify = (req, res) => {
    let { userId, verificationNumber } = req.body;
    PasswordReset.find({ userId })
        .then((result) => {
            if (result.length > 0) {
                const { expiresAt } = result[0];
                const hashedVerificationNumber = result[0].resetString;
                if (expiresAt < Date.now()) {
                    PasswordReset.deleteOne({ userId })
                        .then(() => {
                            res.json({
                                status: 'Failed',
                                message: 'Password reset link has expired.'
                            });
                        })
                        .catch((error) => {
                            res.json({
                                status: 'Failed',
                                message: 'Clearing password reset record failed'
                            });
                        });
                } else {
                    bcrypt
                        .compare(verificationNumber, hashedVerificationNumber)
                        .then((result) => {
                            if (result) {
                                res.json({
                                    status: 'SUCCESS',
                                    message: 'verification number match!.'
                                });
                            } else {
                                res.json({
                                    status: 'Failed',
                                    message:
                                        'Invalid password reset details passed'
                                });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            res.json({
                                status: 'Failed',
                                message:
                                    'Comparing password reset strings failed.'
                            });
                        });
                }
            } else {
                // Password reset record does'nt exist
                res.json({
                    status: 'Failed',
                    message: 'Password reset record request not found'
                });
            }
        })
        .catch((error) => {
            console.log(error);
            res.json({
                status: 'Failed',
                message: 'Checking for existing password reset record failed'
            });
        });
};

module.exports.updateUserData = (req, res) => {
    let { id, name, lastname, birthday } = req.body;
    User.findById(id)
        .then((result) => {
            User.updateOne({ _id: id }, { name, lastname, birthday })
                .then(() => {
                    res.json({
                        status: 'SUCCESS',
                        message: 'user Data has been updated has been updated.'
                    });
                })
                .catch((error) => {
                    console.log(error);
                    res.json({
                        status: 'Failed',
                        message: 'An error occured while updating user name.'
                    });
                });
        })
        .catch((error) => {
            console.log(error);
            res.json({
                status: 'Failed',
                message: 'An error occured while trying to findUserById.'
            });
        });
};

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.PASSWORD
    },
    secure: true
});

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Ready for message');
        console.log(success);
    }
});

const sendVerificationEmail = ({ _id, email }, res) => {
    const uniqueString = uuidv4() + _id;
    const baseUrl = 'http://localhost:3000'; //Backend url
    const verifyUrl = baseUrl + '/api/verify/' + _id + '/' + uniqueString;
    console.log('verifyUrl', verifyUrl);

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'verify email',
        html: `<p>Verify you email address to complete the signup and login into your account. </p>
    <p><b>This link expires in 6 hours.</b></p>
    <p>Press <a href=${verifyUrl}> here </a> to proceed</p> `
    };

    //hash the unique string
    const saltRounds = 8;
    bcrypt
        .hash(uniqueString, saltRounds)
        .then((hashedUniqueString) => {
            //set values in userVerification collection
            const newVerification = new UserVerification({
                userId: _id,
                uniqueString: hashedUniqueString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 2160000
            });
            newVerification
                .save()
                .then(() => {
                    transporter
                        .sendMail(mailOptions)
                        .then(() => {
                            //email sent and verification record saved
                            res.json({
                                status: 'PENDING',
                                message: 'verification email sent'
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                            res.json({
                                status: 'Failed',
                                message: 'Couldnt save verification email data '
                            });
                        });
                })
                .catch((error) => {
                    console.log(error);
                    res.json({
                        status: 'Failed',
                        message: 'An error occured while hashing email data'
                    });
                });
        })
        .catch((error) => {
            res.json({
                status: 'Failed',
                message: 'An error occured while hashing email data'
            });
        });
};
