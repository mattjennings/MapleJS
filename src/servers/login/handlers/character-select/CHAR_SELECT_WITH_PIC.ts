import CharacterModel from '@models/Character'
import { ReceiveOpcode } from '@packets'
import { PacketHandler, PacketWriter } from '@util/maplenet'
import { findDocumentByCutoffId } from '@util/mongoose'
import { getWorldInfoById, ipStringToBytes } from '@util/helpers'

export default new PacketHandler(ReceiveOpcode.CHAR_SELECT_WITH_PIC, async (client, reader) => {
  if (!client.account || !client.state) {
    client.disconnect()
    return
  }
  const pic = reader.readString()

  const characterId = reader.readUInt32()
  const macAddr = reader.readString()
  const macAddrNoDashes = reader.readString()
  enterChannel(client, characterId)
})

function enterChannel(client, pCharacterId) {
  const world = getWorldInfoById(client.state.worldId)

  // Remote-hack vulnerable
  const packet = new PacketWriter(0x000c)
  packet.writeUInt16(0)
  packet.writeBytes(ipStringToBytes(world.publicIP))
  packet.writeUInt16(world.portStart + client.state.channelId)
  packet.writeUInt32(pCharacterId)
  packet.writeUInt8(0) // Flag bit 1 set = korean popup?
  packet.writeUInt32(0) // Minutes left on Internet Cafe?

  client.sendPacket(packet)
}
