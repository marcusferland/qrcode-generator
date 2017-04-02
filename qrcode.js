const qr = require('qrcode')
const speakeasy = require('speakeasy')
const app = require('express')()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bearerToken = require('express-bearer-token')
const compression = require('compression')

const port = 3000
const secretKey = 'rH!y+sZcK-_a TTZyDWjPGAJ q-RF&6-GW' // get this into ZooKeeper

app.use(cors())
app.use(compression())
app.use(bearerToken())

app.get('/jwt', (req, res) => {

  const token = req.token // JWT token
  let secret, decoded

  if ( ! token ) res.status(400).json({
    error: 'Request failed; token not found in request'
  }).end()

  try {
    decoded = jwt.verify(token, secretKey)

    const totptoken = speakeasy.totp({
      secret: decoded.user.secret,
      encoding: 'base32'
    })

    qr.toDataURL(`otpauth://totp/eSentire?secret=${decoded.user.secret}`, (err, data_url) => {
      if (err) res.status(400).json({
        error: 'Request failed; could not generate base64 URL'
      }).end()
      else res.status(200).json({
        url: data_url,
        token: totptoken
      }).end()
    })

  } catch(err) {
    res.status(400).json({
      err
    }).end()
  }

})
app.listen(port, () => {
  console.log(`QR Code generator app is running at http://localhost:${port}/`)
})
