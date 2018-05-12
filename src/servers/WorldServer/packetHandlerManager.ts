import { PacketHandlerManager } from '@util/maplenet'
import * as path from 'path'
const packetHandlerManager = new PacketHandlerManager()

const handlersPath = path.resolve(__dirname, 'handlers')
packetHandlerManager.setHandlersByFiles(handlersPath)

export default packetHandlerManager
