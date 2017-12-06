import crypto from 'crypto'

export const randomToken = (bytes) => {
  var token = crypto.randomBytes(bytes)
  return token.toString('hex')
}
