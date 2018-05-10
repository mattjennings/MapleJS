import CharacterModel from '@models/Character'
import { ReceiveOpcode } from '@packets'
import { PacketHandler, PacketWriter } from '@util/maplenet'
import { findDocumentByCutoffId } from '@util/mongoose'
const serverConfig = require('@config/server')

export default new PacketHandler(ReceiveOpcode.SERVER_LIST_REQUEST, async (client, reader) => {
  if (!client.account) {
    client.disconnect('Trying to view worlds while not loggedin')
    return
  }

  let packet

  for (const worldName in serverConfig.worlds) {
    if (worldName) {
      const world = serverConfig.worlds[worldName]
      packet = new PacketWriter(0x000a)

      packet.writeUInt8(world.id)
      packet.writeString(worldName)
      packet.writeUInt8(world.ribbon)
      packet.writeString(world.eventMessage)
      packet.writeUInt16(100) // EXP Rate
      packet.writeUInt16(100) // DROP Rate
      packet.writeUInt8(world.characterCreationDisabled)

      const channels = world.channels
      packet.writeUInt8(channels)
      let i
      for (i = 1; i <= channels; i++) {
        packet.writeString(worldName + '-' + i)
        packet.writeUInt32(13132) // Online players
        packet.writeUInt8(world.id)
        packet.writeUInt8(i - 1)
        packet.writeUInt8(0)
      }

      packet.writeUInt16(world.dialogs.length)
      for (i = 0; i < world.dialogs.length; i++) {
        const dialog = world.dialogs[i]
        packet.writeUInt16(dialog.x)
        packet.writeUInt16(dialog.y)
        packet.writeString(dialog.text)
      }
      client.sendPacket(packet)
    }
  }

  packet = new PacketWriter(0x000a)
  packet.writeUInt8(0xff)

  client.sendPacket(packet)
})
