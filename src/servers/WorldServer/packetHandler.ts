import { PacketHandlerManager } from '@util/maplenet'

const packetHandler = new PacketHandlerManager()

// require('./handlers/login').default(packetHandler)
// require('./handlers/worldSelect').default(packetHandler)
// require('./handlers/characterSelect').default(packetHandler)

export default packetHandler
