const express = require('express');
const authRouter = express.Router();
const {
    sendCode,
    verifyOtp,
    signup,
    signin,
    refresh,
    tokenIsValid,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    requestPasswordResetByDigits,
    resetPasswordByDigits,
    updateUserData,
    verifyEmailOtp,
    verifySignupOtp,
    signout
    
} = require('../Controllers/userController');
const auth = require('../middlewares/auth');
const { User } = require('../models/user');
const path = require('path');

//Main routes 
//validate token
authRouter.route('/tokenIsValid').post(tokenIsValid)

//get user data
authRouter.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({ ...user._doc, token: req.token });
});

//singnup
authRouter.route('/api/signup').post(signup);

//verifySignupOtp
authRouter.post('/api/verifySignupOtp', verifySignupOtp);

//verifySignupOtp
authRouter.route('/api/signin').post(signin);

//refresh
authRouter.route('/api/refresh').post(refresh);

//signout
authRouter.route('/api/signout').post(signout);

//updateUserData
authRouter.route('/api/updateUserData').post(updateUserData);

//requestPasswordResetByDigits
authRouter.post(
  '/api/requestPasswordResetByDigits',
    requestPasswordResetByDigits
);

//verifyEmail
authRouter.route('/api/verify/:userId/:uniqueString').get(verifyEmail);

//resetPasswordByDigits
authRouter.post('/api/resetPasswordByDigits', resetPasswordByDigits);

//verifyEmailOtp
authRouter.post('/api/verifyEmailOtp', verifyEmailOtp);



//test routes 
//authRouter.route('/api/sendCode').post(sendCode);
//authRouter.route('/api/verifyOtp').post(verifyOtp);
//authRouter.get('/api/verified', (req, res) => {
//   res.sendFile(path.join(__dirname, '../views/verified.html'));
// });
// authRouter.post('/api/requestPasswordReset', requestPasswordReset);
// authRouter.post('/api/resetPassword', resetPassword);

module.exports = authRouter;
