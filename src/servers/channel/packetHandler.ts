import { PacketHandler } from '@util/maplenet'

const packetHandler = new PacketHandler()

// require('./handlers/login').default(packetHandler)
// require('./handlers/worldSelect').default(packetHandler)
// require('./handlers/characterSelect').default(packetHandler)

export default packetHandler