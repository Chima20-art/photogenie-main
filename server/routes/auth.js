const express = require('express')
const authRouter = express.Router()
const { sendCode, verifyOtp, signup, signin, verify } = require('../Controllers/userController')



const path = require('path')

authRouter.route('/api/sendCode').post(sendCode)
authRouter.route('/api/sendCode/verifyOtp').post(verifyOtp)

authRouter.route('/api/signup').post(signup)

authRouter.route('/api/signin').post(signin)

authRouter.route('/api/verify/:userId/:uniqueString').get(verify)

authRouter.get('/api/verified', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/verified.html'))
})

module.exports = authRouter
