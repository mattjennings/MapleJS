import Client from '../../servers/MapleServer/Client'
import { PacketReader } from '@util/maplenet'

class PacketHandler {
  private handlers = {}

  public getHandler(opCode) {
    return this.handlers[opCode] || null
  }

  public setHandler(opCode, callback: (client: Client, reader: PacketReader) => void) {
    this.handlers[opCode] = callback
    console.log(`Registered handler for 0x${opCode.toString(16)}. Total loaded: ${this.getHandlerCount()}`)
  }

  public getHandlerCount() {
    return Object.keys(this.handlers).length
  }
}

export default PacketHandler
