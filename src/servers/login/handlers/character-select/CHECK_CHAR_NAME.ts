import CharacterModel from '@models/Character'
import nxFiles from '@nxFiles'
import { ReceiveOpcode } from '@packets'
import { PacketWriter, PacketHandler } from '@util/maplenet'

const serverConfig = require('@config/server')

async function isNameValid(name, admin) {
  if (!admin) {
    // Check if is a forbidden name
    let forbidden = false
    nxFiles.etc.child('ForbiddenName.img').forEach(node => {
      if (name.indexOf(node.getData()) !== -1) {
        forbidden = true
        return false
      }
    })
    if (forbidden) {
      return false
    }
  }

  const count = await CharacterModel.count({ name })
  return count === 0
}

export default new PacketHandler(ReceiveOpcode.CHECK_CHAR_NAME, async (client, reader) => {
  if (!client.account || !client.state) {
    client.disconnect('Trying the check character name while not loggedin')
    return
  }

  const name = reader.readString()

  let taken = true
  if (name.length >= 4 && name.length <= 12) {
    taken = !(await isNameValid(name, client.account.isAdmin))
  }

  const packet = new PacketWriter(0x000d)
  packet.writeString(name)
  packet.writeUInt8(taken) // Taken bool

  client.sendPacket(packet)
})
