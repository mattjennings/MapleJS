import { ReceiveOpcode } from '@packets'
import { PacketHandler, PacketWriter } from '@util/maplenet'
const serverConfig = require('@config/server')

export default new PacketHandler(ReceiveOpcode.SERVER_STATUS_REQUEST, async (client, reader) => {
  if (!client.account) {
    client.disconnect('Trying to select world while not loggedin')
    return
  }

  const packet = new PacketWriter(0x0003)
  packet.writeUInt8(0)
  packet.writeUInt8(0)

  client.sendPacket(packet)
})
