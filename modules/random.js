import crypto from 'crypto'

export const randomToken = () => {
  var token = crypto.randomBytes(5)
  return token.toString('hex')
}
