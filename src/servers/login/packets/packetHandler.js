const PacketHandler = require('../../../util/maplenet/PacketHandler')
const packetHandler = new PacketHandler()

require('./handlers/login')(packetHandler)
require('./handlers/worldSelect')(packetHandler)

module.exports = packetHandler
