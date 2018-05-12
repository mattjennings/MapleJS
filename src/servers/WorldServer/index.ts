require('@db')

import packetHandlerManager from './packetHandlerManager'
import MapleServer, { MapleServerOptions } from '@util/maplenet/MapleServer'

export default class WorldServer extends MapleServer {
  constructor(options: MapleServerOptions) {
    super(packetHandlerManager, options)
    this.startPinger()
  }
}
