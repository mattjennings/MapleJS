import { ReceiveOpcode } from './receiveOpcodes'
import { SendOpcode } from './sendOpcodes'

export type Opcode = ReceiveOpcode | SendOpcode

export const getOpcodeName = (opCode: Opcode) => {
  if (ReceiveOpcode[opCode]) {
    return ReceiveOpcode[opCode]
  }

  if (SendOpcode[opCode]) {
    return SendOpcode[opCode]
  }

  return null
}

export { ReceiveOpcode, SendOpcode }
