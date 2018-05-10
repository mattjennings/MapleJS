import CharacterModel from '@models/Character'
import { ReceiveOpcode } from '@packets'
import { PacketHandler, PacketWriter } from '@util/maplenet'
import { findDocumentByCutoffId } from '@util/mongoose'

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
