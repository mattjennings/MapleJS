import CharacterModel from '@models/Character'
import { ReceiveOpcode } from '@packets'
import { PacketHandler, PacketWriter } from '@util/maplenet'

export default new PacketHandler(ReceiveOpcode.REGISTER_PIC, async (client, reader) => {
  if (!!client.account.pic) {
    return client.disconnect('Trying to set PIC when one is already registered')
  }

  reader.readInt8() // ?
  const characterId = reader.readUInt32()
  const macs = reader.readMapleAsciiString()
  reader.readMapleAsciiString()
  const pic = reader.readMapleAsciiString()

  client.account.pic = pic
  await client.account.save()
  client.enterChannel(characterId)
})
