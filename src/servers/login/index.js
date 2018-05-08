const mongoose = require('mongoose')
const MapleServer = require('../MapleServer.js')
const packetHandler = require('./packets/packetHandler')
const serverConfig = require('../../../serverConfig')

mongoose.connect(serverConfig.databaseConnectionString)

const server = new MapleServer(packetHandler, {
  name: 'loginserver-0',
  port: 8484,
  version: 83,
  subversion: '1',
  locale: 8
})
server.startPinger()

process.on('SIGINT', function() {
  server.close()
  console.log('TERMINATE')
  process.exit()
})
