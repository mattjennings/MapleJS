import packetHandlerManager from './packetHandlerManager'
import MapleServer from '../MapleServer'
const mongoose = require('mongoose')
const serverConfig = require('@config/server')

mongoose.connect(serverConfig.databaseConnectionString)

const server = new MapleServer(packetHandlerManager, {
  name: 'loginserver-0',
  port: 8484,
  version: 83,
  subversion: '1',
  locale: 8
})
server.startPinger()

process.on('SIGINT', () => {
  server.close()
  console.log('TERMINATE')
  process.exit()
})
