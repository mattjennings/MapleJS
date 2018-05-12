import LoginServer from '../servers/LoginServer'
const serverConfig = require('@config/server')
const { loginServer } = serverConfig

const server = new LoginServer({
  name: 'loginServer',
  ip: loginServer.ip || '127.0.0.1',
  port: loginServer.port || 8484,
  version: serverConfig.version || 83,
  subversion: serverConfig.subversion || '1',
  locale: serverConfig.locale || 8
})

process.on('SIGINT', () => {
  console.log('Shutting down login server')
  server.close()
  console.log('Login server shut down')
  process.exit()
})
