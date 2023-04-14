const express = require('express')
const authRouter = express.Router()
const { sendCode, verifyOtp, signup, signin, verifyEmail, requestPasswordReset, resetPassword,requestPasswordResetOtp,updateUserData,verifyEmailOtp, resetPasswordByOtp } = require('../Controllers/userController')
const auth = require("../middlewares/auth");
const { User } = require('../models/user')


const path = require('path')
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

authRouter.route('/api/sendCode').post(sendCode)
authRouter.route('/api/verifyOtp').post(verifyOtp)


authRouter.route('/api/signup').post(signup)


authRouter.route('/api/signin').post(signin)

authRouter.route('/api/verify/:userId/:uniqueString').get(verifyEmail)

authRouter.route('/api/updateUserData').post(updateUserData)

//verified email page route
authRouter.get('/api/verified', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/verified.html'))
})

authRouter.post('/api/requestPasswordReset', requestPasswordReset)
authRouter.post('/api/resetPassword', resetPassword)

authRouter.post('/api/requestPasswordResetOtp', requestPasswordResetOtp)
authRouter.post('/api/resetPasswordByOtp', resetPasswordByOtp)
authRouter.post('/api/verifyEmailOtp', verifyEmailOtp)

module.exports = authRouter
