import MapleClient from './MapleClient'
import { PacketReader } from '@util/maplenet'
import PacketHandler from './PacketHandler'
import { getOpcodeName, Opcode } from '@packets'
const requireContext = require('require-context')

class PacketHandlerManager {
  private packetHandlers: { [key: string]: PacketHandler } = {}

  public getHandler(opCode) {
    return this.packetHandlers[opCode] || null
  }

  public setHandler(packetHandler: PacketHandler) {
    const { opcode } = packetHandler
    this.packetHandlers[opcode] = packetHandler
    console.log(
      `Registered handler for 0x${opcode.toString(16)} (${getOpcodeName(
        opcode
      )}). Total loaded: ${this.getHandlerCount()}`
    )
  }

  public setHandlersByFiles(path: string, subdirectories: boolean = true, regex: RegExp = /.ts$/) {
    const requires = requireContext(path, subdirectories, regex)
    requires.keys().forEach(file => {
      if (file) {
        const handler: PacketHandler = requires(file).default
        this.setHandler(handler)
      }
    })
  }

  public async runHandler(opcode: Opcode, client: MapleClient, reader: PacketReader) {
    const handler = this.getHandler(opcode)
    if (handler) {
      try {
        console.log(`Executing PacketHandler for ${handler.getOpcodeString()} (${handler.getName()})`)
        await handler.callback(client, reader)
      } catch (exception) {
        console.error(exception, exception.stack)
      }
    } else {
      const emptyHandler = new PacketHandler(opcode, null)
      console.warn(`No PacketHandler for ${emptyHandler.getOpcodeString()} (${emptyHandler.getName()})`)
    }
  }

  public getHandlerCount() {
    return Object.keys(this.packetHandlers).length
  }
}

export default PacketHandlerManager
