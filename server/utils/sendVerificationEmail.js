
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

module.exports = sendVerificationEmail;