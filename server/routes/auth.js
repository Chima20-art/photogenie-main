const express = require('express')
const authRouter = express.Router()
const { sendCode, verifyOtp, signup, signin, verifyEmail, requestPasswordReset, resetPassword,requestPasswordResetByDigits, resetPasswordByDigits } = require('../Controllers/userController')



const path = require('path')

authRouter.route('/api/sendCode').post(sendCode)
authRouter.route('/api/sendCode/verifyOtp').post(verifyOtp)

authRouter.route('/api/signup').post(signup)

authRouter.route('/api/signin').post(signin)

authRouter.route('/api/verify/:userId/:uniqueString').get(verifyEmail)

//verified email page route
authRouter.get('/api/verified', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/verified.html'))
})
resetPassword
authRouter.post('/api/requestPasswordReset', requestPasswordReset)
authRouter.post('/api/resetPassword', resetPassword)

authRouter.post('/api/requestPasswordResetByDigits', requestPasswordResetByDigits)
authRouter.post('/api/resetPasswordByDigits', resetPasswordByDigits)


module.exports = authRouter
