require('@db')

import packetHandlerManager from './packetHandlerManager'
import MapleServer, { MapleServerOptions } from '@util/maplenet/MapleServer'

export interface WorldServerOptions extends MapleServerOptions {
  worldId: number
  channelId: number
}
export default class WorldServer extends MapleServer {
  constructor(options: WorldServerOptions) {
    const { worldId, channelId, ...otherOptions } = options
    super(packetHandlerManager, otherOptions as MapleServerOptions)

    this.worldId = options.worldId
    this.channelId = options.channelId
    this.startPinger()
  }
}
