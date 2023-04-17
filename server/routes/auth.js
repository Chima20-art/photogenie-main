const express = require('express');
const authRouter = express.Router();
const {
    sendCode,
    verifyOtp,
    signup,
    signin,
    refresh,
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
const { isAuthenticated } = require("../middlewares/helper.js");

const path = require('path');

//validate token
authRouter.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.json(false);
        }

        const verified = jwt.verify(token, 'passwordKey');

        if (!verified) {
            return res.json(false);
        }

        const user = await User.findById(verified.id);

        if (!user) {
            return res.json(false);
        } else {
            return res.json(true);
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


//get user data
authRouter.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({ ...user._doc, token: req.token });
});
authRouter.route('/api/signup').post(signup);
authRouter.route('/api/signin').post(signin);
authRouter.route('/api/signout').post(signout);


authRouter.route('/api/refresh').post(refresh);

authRouter.route('/api/sendCode').post(sendCode);

authRouter.route('/api/verifyOtp').post(verifyOtp);

authRouter.route('/api/verify/:userId/:uniqueString').get(verifyEmail);

authRouter.route('/api/updateUserData').post(updateUserData);

//verified email page route
authRouter.get('/api/verified', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/verified.html'));
});

authRouter.post('/api/requestPasswordReset', requestPasswordReset);
authRouter.post('/api/resetPassword', resetPassword);

authRouter.post(
    '/api/requestPasswordResetByDigits',
    requestPasswordResetByDigits
);
authRouter.post('/api/resetPasswordByDigits', resetPasswordByDigits);
authRouter.post('/api/verifyEmailOtp', verifyEmailOtp);
authRouter.post('/api/verifySignupOtp', verifySignupOtp);

module.exports = authRouter;
