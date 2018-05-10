import Account from '@models/Account'
import { ReceiveOpcode } from '@packets'
import { PacketWriter, PacketHandler } from '@util/maplenet'
import { getDocumentId } from '@util/mongoose'
import * as bcrypt from 'bcrypt'

const serverConfig = require('@config/server')

export default new PacketHandler(ReceiveOpcode.LOGIN_PASSWORD, async (client, reader) => {
  const username = reader.readString()
  let password = reader.readString()

  const packet = new PacketWriter(0x0000)
  try {
    let account = await Account.findOne({ name: username })

    if (!account) {
      console.log(username + ' login = not found')
      if (!serverConfig.enableAutoregister) {
        packet.writeUInt16(5)
        packet.writeUInt32(0)
      } else {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        // Autoregister
        account = new Account({
          name: username,
          password: hash,
          salt,
          banResetDate: null,
          creationDate: new Date(),
          female: null,
          isAdmin: false
        })

        await account.save()
      }
    }

    if (!account) {
      client.sendPacket(packet)
      return
    }

    if (typeof account.password === 'undefined') {
      console.log('Updating password')
      account.password = password
      account.salt = null
    }

    password = bcrypt.hashSync(password, account.salt)

    if (account.loggedIn) {
      console.log(username + ' login = already logged in')
      packet.writeUInt16(7)
      packet.writeUInt32(0)
    } else if (account.password !== password) {
      console.log(username + ' login = invalid pass')
      packet.writeUInt16(4)
      packet.writeUInt32(0)
    } else if (account.banResetDate > new Date()) {
      console.log(username + ' login = banned')
      packet.writeUInt16(2)
      packet.writeUInt32(0)
      packet.writeUInt8(account.banReason)
      packet.writeDate(account.banResetDate)
    } else {
      console.log(username + ' login = okay')
      client.account = account
      packet.writeUInt16(0)
      packet.writeUInt32(0)

      packet.writeUInt32(getDocumentId(account))
      packet.writeUInt8(0)
      packet.writeUInt8(account.isAdmin ? 0x40 : 0) // Admin flag
      packet.writeUInt8(0)
      packet.writeUInt8(0)
      packet.writeString(account.name)
      packet.writeUInt8(0)
      packet.writeUInt8(account.muteReason)
      packet.writeDate(account.muteResetDate)

      packet.writeDate(account.creationDate)

      packet.writeUInt32(0)

      // PIC info
      packet.writeUInt8(1)
      packet.writeUInt8(1)
    }
  } catch (exception) {
    console.log(username + ' login = error')
    console.error(exception, exception.stacktrace)
    packet.writeUInt16(10) // too many requests
    packet.writeUInt32(0)
  }

  client.sendPacket(packet)
})
