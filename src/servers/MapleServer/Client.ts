import * as net from 'net'
import MapleServer from './MapleServer'
import { mapleSocket } from '@util/maplenet'
import { Account } from '@models/Account'
import { InstanceType } from 'typegoose'

class Client {
  public server: MapleServer
  public socket: net.Socket

  public account?: InstanceType<Account>
  public state?: {
    worldId: number
    channelId: number
  }

  constructor(server: MapleServer, socket: net.Socket) {
    this.server = server
    this.socket = socket
  }

  public sendPacket(packet) {
    let buffer = new Buffer(4)
    const socket = this.socket
    mapleSocket.generateHeader(buffer, socket.serverSequence, packet.writtenData, -(this.server.version + 1))
    socket.write(buffer)

    buffer = packet.getBufferCopy()
    mapleSocket.encryptData(buffer, socket.serverSequence)

    socket.serverSequence = mapleSocket.morphSequence(socket.serverSequence)

    socket.write(buffer)
  }

  public disconnect(reason?: string) {
    if (reason) {
      console.log('Disconnecting client. Reason: ' + reason)
    } else {
      console.log('Disconnecting client.')
    }
    const socket = this.socket

    socket.end()
    socket.destroy()
  }
}

export default Client
