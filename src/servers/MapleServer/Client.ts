import MapleServer from './MapleServer'
import * as net from 'net'
import { mapleSocket } from '../../util/maplenet'

class Client {
  public server: MapleServer
  public socket: net.Socket

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

  public disconnect(reason) {
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
