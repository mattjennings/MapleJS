import Client from '../../servers/MapleServer/Client'
import { PacketReader } from '@util/maplenet'
import { Opcode } from '@packets'
import { getOpcodeName, ReceiveOpcode } from '@packets'

class PacketHandler {
  public opcode: Opcode
  public callback: (client: Client, reader: PacketReader) => void

  constructor(opcode: Opcode, callback: (client: Client, reader: PacketReader) => void) {
    this.opcode = opcode
    this.callback = callback
  }

  public getName() {
    return getOpcodeName(this.opcode)
  }

  public getOpcodeString() {
    return `0x${this.opcode.toString(16)}`
  }
}

export default PacketHandler
