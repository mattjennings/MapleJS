import { ReceiveOpcode } from '@packets'
import { PacketHandler, PacketWriter } from '@util/maplenet'

function wrongPicPacket() {
  const packet = new PacketWriter(0x001c)
  packet.writeUInt32(20)
  return packet
}

export default new PacketHandler(ReceiveOpcode.CHAR_SELECT_WITH_PIC, async (client, reader) => {
  if (!client.account || !client.state) {
    client.disconnect()
    return
  }
  const pic = reader.readString()

  const characterId = reader.readUInt32()
  const macAddr = reader.readString()
  const macAddrNoDashes = reader.readString()

  if (pic !== client.account.pic) {
    return client.sendPacket(wrongPicPacket())
  } else {
    return client.enterChannel(characterId)
  }
})
