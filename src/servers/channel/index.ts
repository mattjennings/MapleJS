require('@db')

import packetHandler from './packetHandler'
import MapleServer from '../MapleServer'

const server = new MapleServer(packetHandler, {
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
