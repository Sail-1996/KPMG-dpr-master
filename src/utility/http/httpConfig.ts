// ** Api Endpoints
// const domain = 'demo-dpr-api.3mad.in'
const baseUrl = import.meta.env.VITE_API_URL ?? 'localhost:8000'
const enableSsl = import.meta.env.VITE_SSL ?? false
const domain =
  enableSsl === 'true' || enableSsl === true ? `https://${baseUrl}` : `http://${baseUrl}`
export default {
  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',
  entryPoint: 'web',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'dpr-token',
  storageRefreshTokenKeyName: 'dpr-token-refresh',
  storageUserData: 'dpr-userdata',

  // base api urls
  baseUrl: `${domain}/api/`,
  baseUrl2: `${domain}/`,
  baseUrl3: `${domain}`,

  enableSocket: false,
  socketChatUrl: `ws://${baseUrl}:8090`,

  socketNotificationUrl: baseUrl,
  socketNotificationPort: 6001,

  // ** This will be used to encrypt/decrypt data
  encryptKey: 'us5N0PxHAWuIgb0/Qc2sh5OdWBbXGady',
  enableAES: true
}
