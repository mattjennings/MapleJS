import CharacterModel from '@models/Character'
import { ReceiveOpcode } from '@packets'
import { PacketHandler, PacketWriter } from '@util/maplenet'
import { findDocumentByCutoffId } from '@util/mongoose'

export default new PacketHandler(ReceiveOpcode.DELETE_CHAR, async (client, reader) => {
  // Deleting character
  if (!client.account || !client.state) {
    client.disconnect('Trying the check character name while not loggedin')
    return
  }

  const pic = reader.readString()

  const id = reader.readUInt32()
  const character = await findDocumentByCutoffId(CharacterModel, id, {
    worldId: client.state.worldId
  })

  if (!character) {
    client.disconnect('Character did not exist.')
    return
  }

  if (!client.account.equals(character.account)) {
    client.disconnect('Client tried to delete someone elses character.')
    return
  }

  await character.remove()

  const packet = new PacketWriter(0x000f)
  packet.writeUInt32(id)
  packet.writeUInt8(0)

  client.sendPacket(packet)
})
