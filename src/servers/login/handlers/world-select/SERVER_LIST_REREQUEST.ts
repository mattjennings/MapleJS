import { ReceiveOpcode } from '@packets'
import { PacketHandler, PacketWriter } from '@util/maplenet'

import serverListRequestHandler from './SERVER_LIST_REQUEST'

export default new PacketHandler(ReceiveOpcode.SERVER_LIST_REREQUEST, serverListRequestHandler.callback)
