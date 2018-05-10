import Client from '../../servers/MapleServer/Client'
import { PacketReader } from '@util/maplenet'
import { getOpcodeName, Opcode } from '@packets'

class PacketHandler {
  private handlers = {}

  public getHandler(opCode) {
    return this.handlers[opCode] || null
  }

  public setHandler(opCode: Opcode, callback: (client: Client, reader: PacketReader) => void) {
    this.handlers[opCode] = callback
    console.log(
      `Registered handler for 0x${opCode.toString(16)} (${getOpcodeName(
        opCode
      )}). Total loaded: ${this.getHandlerCount()}`
    )
  }

  public getHandlerCount() {
    return Object.keys(this.handlers).length
  }
}

export default PacketHandler
