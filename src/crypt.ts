import CryptoJS from 'crypto-js'

export const getRememberCryptoSecret = () => {
  return window.localStorage.getItem('crypto_secret')
}

export const rememberCryptoSecret = (secret: string) => {
  window.localStorage.setItem('crypto_secret', secret)
}

export const removeRememberCryptoSecret = () => {
  window.localStorage.removeItem('crypto_secret')
}

export const encrypt = (message: string, secret: string) =>
  CryptoJS.AES.encrypt(message, secret).toString()

export const decrypt = (message: string, secret: string) =>
  CryptoJS.AES.decrypt(message, secret).toString(CryptoJS.enc.Utf8)
