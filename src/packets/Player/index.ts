import { PacketWriter, PacketHandler } from '@util/maplenet'

export enum ServerChangeBlockedReasons {
  CANNOT_GO = 1,
  NO_CASHSHOP_AVAILABLE = 2,
  MTS_UNAVAILABLE = 3,
  MTS_USER_LIMIT_REACHED = 4,
  LEVEL_TOO_LOW = 5
}

export const getYellowMessage = pText => {
  const packet = new PacketWriter(0x004d)
  packet.writeUInt8(1)
  packet.writeString(pText)
  return packet
}

export const getServerChangeBlockedMessage = pReason => {
  const packet = new PacketWriter(0x0084)
  packet.writeUInt8(pReason)
  return packet
}
