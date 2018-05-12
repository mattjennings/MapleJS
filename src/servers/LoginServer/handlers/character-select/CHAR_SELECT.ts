import { ReceiveOpcode } from '@packets'
import { PacketHandler } from '@util/maplenet'

export default new PacketHandler(ReceiveOpcode.CHAR_SELECT, async (client, reader) => {
  if (!client.account || !client.state) {
    client.disconnect()
    return
  }

  const characterId = reader.readUInt32()
  const macAddr = reader.readString()
  const macAddrNoDashes = reader.readString()
  client.enterChannel(characterId)
})
