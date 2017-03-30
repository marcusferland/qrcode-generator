const qr = require('qrcode')
const speakeasy = require('speakeasy')
const app = require('express')()
const cors = require('cors')
const port = 3000

app.use(cors())
app.get('/:secret', (req, res) => {

  const secret = req.params.secret

  if ( ! secret ) res.status(500).json({
    error: 'Request failed; could not generate base64 URL'
  }).end()

  const token = speakeasy.totp({
    secret: secret,
    encoding: 'base32'
  })

  qr.toDataURL(`otpauth://totp/SecretKey?secret=${secret}`, (err, data_url) => {
    if (err) res.status(500).json({
      error: 'Request failed; could not generate base64 URL'
    }).end()
    else res.status(200).json({
      url: data_url,
      token: token
    }).end()
  })

})
app.listen(port, () => {
  console.log(`QR Code generator app is running at http://localhost:${port}/`);
})
