import { PacketWriter, PacketHandler } from '@util/maplenet'
import { ReceiveOpcode } from '@packets'
const serverConfig = require('@config/server')

const getWorldInfoById = id => {
  for (const name in serverConfig.worlds) {
    if (serverConfig.worlds[name].id === id) {
      return serverConfig.worlds[name]
    }
  }
  return null
}

// Request worlds
const showWorldsPacketHandler = client => {
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
}

export default (packetHandler: PacketHandler) => {
  packetHandler.setHandler(ReceiveOpcode.SERVERLIST_REQUEST, showWorldsPacketHandler)
  packetHandler.setHandler(ReceiveOpcode.SERVERLIST_REREQUEST, showWorldsPacketHandler)

  packetHandler.setHandler(ReceiveOpcode.SERVERSTATUS_REQUEST, client => {
    if (!client.account) {
      client.disconnect('Trying to select world while not loggedin')
      return
    }

    const packet = new PacketWriter(0x0003)
    packet.writeUInt8(0)
    packet.writeUInt8(0)

    client.sendPacket(packet)
  })

  packetHandler.setHandler(ReceiveOpcode.CHARLIST_REQUEST, async (client, reader) => {
    // Select channel

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
}
