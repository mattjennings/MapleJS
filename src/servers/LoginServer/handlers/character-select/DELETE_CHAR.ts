import CharacterModel from '@models/Character'
import { ReceiveOpcode } from '@packets'
import { PacketHandler, PacketWriter } from '@util/maplenet'
import { InstanceType } from 'typegoose'
import { Account } from '@models/Account'
export default new PacketHandler(ReceiveOpcode.DELETE_CHAR, async (client, reader) => {
  if (!client.account || !client.state) {
    client.disconnect('Trying the check character name while not loggedin')
    return
  }

  const pic = reader.readString()

  const id = reader.readUInt32()
  const character = await CharacterModel.findOne({ _id: id, worldId: client.state.worldId })
  const characterAccount: InstanceType<Account> = client.account

  if (!character) {
    client.disconnect('Character did not exist.')
    return
  }

  if (!client.account.equals(characterAccount)) {
    client.disconnect('Client tried to delete someone elses character.')
    return
  }

  await character.remove()

  const packet = new PacketWriter(0x000f)
  packet.writeUInt32(id)
  packet.writeUInt8(0)

  client.sendPacket(packet)
})
