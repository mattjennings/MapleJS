import { ReceiveOpcode } from '@packets'
import { PacketHandler, PacketWriter } from '@util/maplenet'
const serverConfig = require('@config/server')

const getWorldInfoById = id => {
  for (const name in serverConfig.worlds) {
    if (serverConfig.worlds[name].id === id) {
      return serverConfig.worlds[name]
    }
  }
  return null
}

export default new PacketHandler(ReceiveOpcode.CHAR_LIST_REQUEST, async (client, reader) => {
  if (!client.account) {
    client.disconnect('Trying to select channel while not loggedin')
    return
  }

  if (reader.readUInt8() !== 2) {
    return
  }
  const worldId = reader.readUInt8()
  const channelId = reader.readUInt8()

  const world = getWorldInfoById(worldId)

  const packet = new PacketWriter(0x000b)
  if (world === null || channelId < 0 || channelId > world.channels) {
    packet.writeUInt8(8)
  } else {
    client.state = {
      worldId,
      channelId
    }

    packet.writeUInt8(0)

    const characters = await client.account.getCharacters(client.state.worldId)
    packet.writeUInt8(characters.length)

    for (let i = 0; i < characters.length; i++) {
      const character = characters[i]

      await character.addStats(packet)
      await character.addAvatar(packet)

      packet.writeUInt8(0) // ?

      packet.writeUInt8(false) // No rankings
      // packet.writeUInt32(character.rankWorld);
      // packet.writeUInt32(character.rankWorldChange);
      // packet.writeUInt32(character.rankJob);
      // packet.writeUInt32(character.rankJobChange);
      /*
    packet.writeUInt32(1);
    packet.writeUInt32(1);
    packet.writeUInt32(1);
    packet.writeUInt32(1);
    */
    }

    packet.writeUInt8(1) // PIC registered
    packet.writeUInt32(6) // Max Characters
  }

  client.sendPacket(packet)
})
