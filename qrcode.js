const qr = require('qrcode')
const speakeasy = require('speakeasy')
const app = require('express')()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bearerToken = require('express-bearer-token')

const port = 3000
const secretKey = 'rH!y+sZcK-_a TTZyDWjPGAJ q-RF&6-GW' // get this into ZooKeeper

app.use(cors())
app.use(bearerToken())

app.get('/jwt', (req, res) => {

  const token = req.token // JWT token
  let secret

  if ( ! token ) res.status(500).json({
    error: 'Request failed; token not found'
  }).end()

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) res.status(500).json({
      error: 'Could not verify JWT'
    })
    else secret = decoded.secret
  })

  const totptoken = speakeasy.totp({
    secret: secret,
    encoding: 'base32'
  })

  qr.toDataURL(`otpauth://totp/SecretKey?secret=${secret}`, (err, data_url) => {
    if (err) res.status(500).json({
      error: 'Request failed; could not generate base64 URL'
    }).end()
    else res.status(200).json({
      url: data_url,
      token: totptoken
    }).end()
  })

})
app.listen(port, () => {
  console.log(`QR Code generator app is running at http://localhost:${port}/`)
})
