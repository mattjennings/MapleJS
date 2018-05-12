require('@db')

import packetHandlerManager from './packetHandler'
import MapleServer, { MapleServerOptions } from '../MapleServer'

export default class WorldServer extends MapleServer {
  constructor(options: MapleServerOptions) {
    super(packetHandlerManager, options)
    this.startPinger()
  }
}
